import { DailyChallenge, Problem, UserProblem } from '../models/index.js';

const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const getTodayDailyChallenge = async (userId = null) => {
  const today = getTodayString();
  let challenge = await DailyChallenge.findOne({ date: today }).populate({
    path: 'problemId',
    populate: { path: 'topics', select: 'name slug icon' }
  });

  // If no daily challenge configured for today, pick a published problem dynamically
  if (!challenge) {
    const randomProblem = await Problem.findOne({ status: 'PUBLISHED' }).populate('topics', 'name slug icon');
    if (randomProblem) {
      challenge = await DailyChallenge.create({
        date: today,
        problemId: randomProblem._id,
        bonusXp: 20,
        bonusRating: 15
      });
      challenge.problemId = randomProblem;
    }
  }

  if (!challenge || !challenge.problemId) {
    return null;
  }

  // Check if current user has solved it
  let isCompleted = false;
  if (userId) {
    const userProblem = await UserProblem.findOne({
      userId,
      problemId: challenge.problemId._id,
      status: 'SOLVED'
    });
    isCompleted = !!userProblem;
  }

  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);
  const timeRemainingMs = Math.max(0, endOfDay.getTime() - now.getTime());

  return {
    date: challenge.date,
    problem: challenge.problemId,
    bonusXp: challenge.bonusXp,
    bonusRating: challenge.bonusRating,
    isCompleted,
    timeRemainingMs,
    totalCompletions: challenge.completedBy ? challenge.completedBy.length : 0
  };
};
