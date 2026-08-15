import { Problem, Submission, UserProblem, User, RatingHistory, XPTransaction } from '../models/index.js';
import { evaluateSubmission } from './judgeService.js';
import { calculateRating, calculateXP, calculateLevel, calculateRank } from '../config/gameConfig.js';
import { recordDailyActivity } from './streakService.js';
import { checkAndUnlockAchievements } from './achievementService.js';

export const submitSolution = async ({
  userId,
  problemId,
  language,
  code
}) => {
  // Fetch problem with all test cases
  const problem = await Problem.findById(problemId);
  if (!problem) {
    const error = new Error('Problem not found');
    error.statusCode = 404;
    throw error;
  }

  // Evaluate submission against test cases
  const evalResult = await evaluateSubmission({
    code,
    language,
    testCases: problem.testCases || [],
    timeLimit: problem.timeLimit,
    memoryLimit: problem.memoryLimit
  });

  const isAccepted = evalResult.status === 'ACCEPTED';

  // Create submission record
  const submission = await Submission.create({
    userId,
    problemId: problem._id,
    language,
    code,
    status: evalResult.status,
    runtime: evalResult.runtime,
    memory: evalResult.memory,
    passedTestCases: evalResult.passedTestCases,
    totalTestCases: evalResult.totalTestCases,
    testResults: evalResult.testResults,
    errorMessage: evalResult.errorMessage
  });

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

  // Gamification & Reward Settlement (Strictly Idempotent!)
  let gamificationResult = {
    isAccepted,
    isFirstSolve: false,
    xpAwarded: 0,
    ratingAwarded: 0,
    newRating: 0,
    newXP: 0,
    newLevel: 1,
    newRank: 'Bronze III',
    streak: null,
    newlyUnlockedAchievements: []
  };

  const user = await User.findById(userId);

  if (isAccepted && !wasAlreadySolved) {
    // First-time Accepted Solve
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

    // Update User Stats
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

    // Log Rating History Audit Trail
    await RatingHistory.create({
      userId,
      change: ratingAward,
      newRating,
      reason: `Solved problem: ${problem.title} (${problem.difficulty})`,
      source: problem._id.toString(),
      sourceType: 'problem'
    });

    // Log XP Transaction Audit Trail
    await XPTransaction.create({
      userId,
      amount: xpAward,
      newTotal: newXP,
      reason: `Solved problem: ${problem.title} (${problem.difficulty})`,
      source: problem._id.toString(),
      sourceType: 'problem'
    });

    // Record User Problem Reward Flag
    userProblem.rewardGranted = true;
    userProblem.xpGranted = xpAward;
    userProblem.ratingGranted = ratingAward;
    problem.stats.solveCount = (problem.stats.solveCount || 0) + 1;

    // Update Streak
    const streakInfo = await recordDailyActivity(userId, 1, xpAward);

    // Check & Trigger Achievements
    const newlyUnlockedAchievements = await checkAndUnlockAchievements(user, {
      problemDifficulty: problem.difficulty,
      topicIds: problem.topics
    });

    await user.save({ validateBeforeSave: false });

    // Enriched Submission Response
    submission.isFirstAccepted = true;
    submission.xpAwarded = xpAward;
    submission.ratingAwarded = ratingAward;
    await submission.save();

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
  } else {
    // Already solved or Not Accepted
    user.stats.totalSubmissions = (user.stats.totalSubmissions || 0) + 1;
    if (isAccepted) {
      user.stats.acceptedSubmissions = (user.stats.acceptedSubmissions || 0) + 1;
    }
    user.stats.accuracy = Math.round(
      ((user.stats.acceptedSubmissions || 0) / (user.stats.totalSubmissions || 1)) * 100
    );
    await user.save({ validateBeforeSave: false });

    gamificationResult = {
      isAccepted,
      isFirstSolve: false,
      xpAwarded: 0,
      ratingAwarded: 0,
      newRating: user.stats.rating || 0,
      newXP: user.stats.xp || 0,
      newLevel: user.stats.level || 1,
      newRank: user.stats.rank || 'Bronze III',
      streak: null,
      newlyUnlockedAchievements: []
    };
  }

  await userProblem.save();
  await problem.save();

  return {
    submission,
    gamification: gamificationResult
  };
};

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
