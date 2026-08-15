import { User, UserProblem, Topic, RatingHistory, XPTransaction, Streak, Problem } from '../models/index.js';

export const getUserAnalytics = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Difficulty breakdown
  const totalProblemsCount = {
    total: await Problem.countDocuments({ status: 'PUBLISHED' }),
    easy: await Problem.countDocuments({ status: 'PUBLISHED', difficulty: 'Easy' }),
    medium: await Problem.countDocuments({ status: 'PUBLISHED', difficulty: 'Medium' }),
    hard: await Problem.countDocuments({ status: 'PUBLISHED', difficulty: 'Hard' })
  };

  const difficultyStats = {
    easy: {
      solved: user.stats.easySolved || 0,
      total: totalProblemsCount.easy,
      percentage: totalProblemsCount.easy > 0 ? Math.round(((user.stats.easySolved || 0) / totalProblemsCount.easy) * 100) : 0
    },
    medium: {
      solved: user.stats.mediumSolved || 0,
      total: totalProblemsCount.medium,
      percentage: totalProblemsCount.medium > 0 ? Math.round(((user.stats.mediumSolved || 0) / totalProblemsCount.medium) * 100) : 0
    },
    hard: {
      solved: user.stats.hardSolved || 0,
      total: totalProblemsCount.hard,
      percentage: totalProblemsCount.hard > 0 ? Math.round(((user.stats.hardSolved || 0) / totalProblemsCount.hard) * 100) : 0
    }
  };

  // Topic mastery stats
  const allTopics = await Topic.find().sort({ order: 1 });
  const userProblems = await UserProblem.find({ userId }).populate({
    path: 'problemId',
    populate: { path: 'topics' }
  });

  const topicMap = {};
  allTopics.forEach(t => {
    topicMap[t._id.toString()] = {
      id: t._id,
      name: t.name,
      slug: t.slug,
      icon: t.icon,
      solved: 0,
      attempts: 0,
      accuracy: 0,
      status: 'Needs Practice'
    };
  });

  userProblems.forEach(up => {
    if (!up.problemId || !up.problemId.topics) return;
    up.problemId.topics.forEach(t => {
      const tId = t._id.toString();
      if (topicMap[tId]) {
        topicMap[tId].attempts += up.attempts;
        if (up.status === 'SOLVED') {
          topicMap[tId].solved += 1;
        }
      }
    });
  });

  const topicPerformance = Object.values(topicMap).map(t => {
    const accuracy = t.attempts > 0 ? Math.round((t.solved / t.attempts) * 100) : 0;
    let status = 'Needs Practice';
    if (accuracy >= 75 && t.solved >= 3) status = 'Strong';
    else if (accuracy >= 50 || t.solved >= 1) status = 'Average';

    return {
      ...t,
      accuracy,
      status
    };
  });

  // Rating Progression History (last 30 changes)
  const ratingHistory = await RatingHistory.find({ userId })
    .sort({ createdAt: 1 })
    .limit(50);

  // Activity streak calendar (last 365 days)
  const activityCalendar = await Streak.find({ userId })
    .sort({ date: 1 })
    .limit(365);

  return {
    user: user.toPublicProfile(),
    overview: {
      rating: user.stats.rating || 0,
      rank: user.stats.rank || 'Bronze III',
      xp: user.stats.xp || 0,
      level: user.stats.level || 1,
      totalSolved: user.stats.problemsSolved || 0,
      accuracy: user.stats.accuracy || 0,
      currentStreak: user.stats.currentStreak || 0,
      longestStreak: user.stats.longestStreak || 0
    },
    difficultyStats,
    topicPerformance,
    ratingHistory,
    activityCalendar
  };
};
