import { Problem, Submission, UserProblem, User, RatingHistory, XPTransaction, ProblemTestCase } from '../models/index.js';
import { evaluateSubmission } from './judgeService.js';
import { calculateRating, calculateXP, calculateLevel, calculateRank } from '../config/gameConfig.js';
import { recordDailyActivity } from './streakService.js';
import { checkAndUnlockAchievements } from './achievementService.js';
import { syncUserLeaderboardScore } from './leaderboardService.js';
import { queueSubmissionEvaluation } from '../queues/submissionQueue.js';
import { redis, redisAvailable } from '../config/redis.js';
import { logger } from '../config/logger.js';

export const SUBMISSION_COMPLETED_CHANNEL = 'submission:completed';

/**
 * 2.1. Fast Asynchronous Submission API (< 30ms response)
 * Validates, writes Submission with status QUEUED, and pushes to BullMQ
 */
export const submitSolutionAsync = async ({
  userId,
  problemId,
  language,
  code
}) => {
  const problem = await Problem.findById(problemId).select('_id title difficulty status');
  if (!problem) {
    const error = new Error('Problem not found');
    error.statusCode = 404;
    throw error;
  }

  // Create immediate submission record with status QUEUED
  const submission = await Submission.create({
    userId,
    problemId: problem._id,
    language,
    code,
    status: 'QUEUED',
    runtime: 0,
    memory: 0,
    passedTestCases: 0,
    totalTestCases: 0,
    testResults: []
  });

  // Push to BullMQ queue
  const job = await queueSubmissionEvaluation({
    submissionId: submission._id.toString(),
    userId: userId.toString(),
    problemId: problem._id.toString(),
    language,
    code
  });

  // If BullMQ/Redis is unavailable, execute asynchronously in process tick
  if (!job) {
    process.nextTick(() => {
      processSubmissionExecution({
        submissionId: submission._id.toString(),
        userId: userId.toString(),
        problemId: problem._id.toString(),
        language,
        code
      }).catch(err => logger.error({ err, submissionId: submission._id }, 'Async fallback execution failed'));
    });
  }

  return {
    submissionId: submission._id,
    status: 'QUEUED',
    queuedAt: submission.createdAt
  };
};

/**
 * Worker / Asynchronous Evaluation & Gamification Settlement
 */
export const processSubmissionExecution = async ({
  submissionId,
  userId,
  problemId,
  language,
  code
}) => {
  const [problem, hiddenTestCasesDoc] = await Promise.all([
    Problem.findById(problemId),
    ProblemTestCase.findOne({ problemId })
  ]);

  if (!problem) throw new Error(`Problem not found: ${problemId}`);

  // Combine public test cases and hidden test cases
  const publicTestCases = problem.testCases || [];
  const hiddenTestCases = hiddenTestCasesDoc?.testCases || [];
  const allTestCases = [...publicTestCases, ...hiddenTestCases];

  // Transition to RUNNING
  await Submission.findByIdAndUpdate(submissionId, { status: 'RUNNING' });

  // Evaluate against test cases
  const evalResult = await evaluateSubmission({
    code,
    language,
    testCases: allTestCases,
    timeLimit: problem.timeLimit || 2000,
    memoryLimit: problem.memoryLimit || 256
  });

  const isAccepted = evalResult.status === 'ACCEPTED';

  // Fetch or create user problem tracking state
  let userProblem = await UserProblem.findOne({ userId, problemId: problem._id });
  const isFirstAttempt = !userProblem;
  const wasAlreadySolved = userProblem && userProblem.status === 'SOLVED';

  if (!userProblem) {
    userProblem = new UserProblem({
      userId,
      problemId: problem._id,
      status: isAccepted ? 'SOLVED' : 'ATTEMPTED',
      attempts: 1,
      language
    });
  } else {
    userProblem.attempts += 1;
    if (isAccepted && !wasAlreadySolved) {
      userProblem.status = 'SOLVED';
    }
  }

  userProblem.lastAttemptAt = new Date();
  if (isAccepted) {
    if (!userProblem.bestRuntime || evalResult.runtime < userProblem.bestRuntime) {
      userProblem.bestRuntime = evalResult.runtime;
    }
    if (!userProblem.bestMemory || evalResult.memory < userProblem.bestMemory) {
      userProblem.bestMemory = evalResult.memory;
    }
    if (!wasAlreadySolved) {
      userProblem.solvedAt = new Date();
    }
  }

  // Update Problem total submissions
  problem.stats.totalSubmissions = (problem.stats.totalSubmissions || 0) + 1;
  if (isAccepted) {
    problem.stats.acceptedSubmissions = (problem.stats.acceptedSubmissions || 0) + 1;
  }
  problem.stats.successRate = Math.round(
    ((problem.stats.acceptedSubmissions || 0) / (problem.stats.totalSubmissions || 1)) * 100
  );

  let gamificationResult = {
    isAccepted,
    isFirstSolve: false,
    xpAwarded: 0,
    ratingAwarded: 0
  };

  const user = await User.findById(userId);

  if (isAccepted && !wasAlreadySolved && user) {
    const ratingAward = calculateRating({ difficulty: problem.difficulty });
    const xpAward = calculateXP({
      difficulty: problem.difficulty,
      isFirstSolve: isFirstAttempt,
      isDailyChallenge: false,
      streakDays: user.stats.currentStreak || 0
    });

    const oldRating = user.stats.rating || 0;
    const newRating = oldRating + ratingAward;
    const oldXP = user.stats.xp || 0;
    const newXP = oldXP + xpAward;
    const newLevel = calculateLevel(newXP);
    const newRankInfo = calculateRank(newRating);

    user.stats.rating = newRating;
    user.stats.xp = newXP;
    user.stats.level = newLevel;
    user.stats.rank = newRankInfo.fullName;
    user.stats.problemsSolved = (user.stats.problemsSolved || 0) + 1;
    user.stats.totalSubmissions = (user.stats.totalSubmissions || 0) + 1;
    user.stats.acceptedSubmissions = (user.stats.acceptedSubmissions || 0) + 1;

    if (problem.difficulty === 'Easy') user.stats.easySolved = (user.stats.easySolved || 0) + 1;
    if (problem.difficulty === 'Medium') user.stats.mediumSolved = (user.stats.mediumSolved || 0) + 1;
    if (problem.difficulty === 'Hard') user.stats.hardSolved = (user.stats.hardSolved || 0) + 1;

    user.stats.accuracy = Math.round(
      (user.stats.acceptedSubmissions / user.stats.totalSubmissions) * 100
    );

    await RatingHistory.create({
      userId,
      change: ratingAward,
      newRating,
      reason: `Solved problem: ${problem.title} (${problem.difficulty})`,
      source: problem._id.toString(),
      sourceType: 'problem'
    });

    await XPTransaction.create({
      userId,
      amount: xpAward,
      newTotal: newXP,
      reason: `Solved problem: ${problem.title} (${problem.difficulty})`,
      source: problem._id.toString(),
      sourceType: 'problem'
    });

    userProblem.rewardGranted = true;
    userProblem.xpGranted = xpAward;
    userProblem.ratingGranted = ratingAward;
    problem.stats.solveCount = (problem.stats.solveCount || 0) + 1;

    const streakInfo = await recordDailyActivity(userId, 1, xpAward);
    const newlyUnlockedAchievements = await checkAndUnlockAchievements(user, {
      problemDifficulty: problem.difficulty,
      topicIds: problem.topics
    });

    await user.save({ validateBeforeSave: false });

    // Sync to Redis ZSET O(1) Leaderboards
    await Promise.allSettled([
      syncUserLeaderboardScore(userId, 'rating', newRating),
      syncUserLeaderboardScore(userId, 'xp', newXP),
      syncUserLeaderboardScore(userId, 'problems_solved', user.stats.problemsSolved),
      syncUserLeaderboardScore(userId, 'streak', user.stats.currentStreak)
    ]);

    gamificationResult = {
      isAccepted: true,
      isFirstSolve: true,
      xpAwarded: xpAward,
      ratingAwarded: ratingAward,
      newRating,
      newXP,
      newLevel,
      newRank: newRankInfo.fullName,
      streak: streakInfo,
      newlyUnlockedAchievements
    };
  } else if (user) {
    user.stats.totalSubmissions = (user.stats.totalSubmissions || 0) + 1;
    if (isAccepted) {
      user.stats.acceptedSubmissions = (user.stats.acceptedSubmissions || 0) + 1;
    }
    user.stats.accuracy = Math.round(
      ((user.stats.acceptedSubmissions || 0) / (user.stats.totalSubmissions || 1)) * 100
    );
    await user.save({ validateBeforeSave: false });
  }

  await userProblem.save();
  await problem.save();

  // Finalize Submission
  const updatedSubmission = await Submission.findByIdAndUpdate(
    submissionId,
    {
      status: evalResult.status,
      runtime: evalResult.runtime,
      memory: evalResult.memory,
      passedTestCases: evalResult.passedTestCases,
      totalTestCases: evalResult.totalTestCases,
      testResults: evalResult.testResults,
      errorMessage: evalResult.errorMessage,
      isFirstAccepted: gamificationResult.isFirstSolve,
      xpAwarded: gamificationResult.xpAwarded,
      ratingAwarded: gamificationResult.ratingAwarded
    },
    { new: true }
  );

  // 2.1. Verdict Delivery: Publish to Redis Pub/Sub
  if (redisAvailable) {
    try {
      const payload = JSON.stringify({
        submissionId,
        userId,
        status: evalResult.status,
        runtime: evalResult.runtime,
        memory: evalResult.memory,
        passedTestCases: evalResult.passedTestCases,
        totalTestCases: evalResult.totalTestCases,
        testResults: evalResult.testResults,
        errorMessage: evalResult.errorMessage,
        gamification: gamificationResult
      });
      await redis.publish(SUBMISSION_COMPLETED_CHANNEL, payload);
      await redis.publish(`${SUBMISSION_COMPLETED_CHANNEL}:${submissionId}`, payload);
    } catch (err) {
      logger.warn({ err, submissionId }, 'Failed to publish submission:completed to Redis PubSub');
    }
  }

  return {
    submission: updatedSubmission,
    gamification: gamificationResult
  };
};

export const submitSolution = submitSolutionAsync;


export const getSubmissionById = async (id, userId) => {
  const submission = await Submission.findById(id)
    .populate('problemId', 'title slug difficulty problemNumber')
    .populate('userId', 'username displayName avatar');

  if (!submission) {
    const error = new Error('Submission not found');
    error.statusCode = 404;
    throw error;
  }

  return submission;
};

export const getSubmissions = async ({
  userId,
  problemId,
  page = 1,
  limit = 20,
  status
}) => {
  const query = {};
  if (userId) query.userId = userId;
  if (problemId) query.problemId = problemId;
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Submission.countDocuments(query);

  const submissions = await Submission.find(query)
    .populate('problemId', 'title slug difficulty problemNumber')
    .select('-testResults')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    submissions,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / Number(limit))
  };
};
