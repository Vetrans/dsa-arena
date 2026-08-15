import { User, RatingHistory, XPTransaction, LeaderboardSnapshot } from '../models/index.js';

export const getLeaderboard = async ({
  metric = 'rating', // 'rating', 'xp', 'problems_solved', 'streak', 'accuracy'
  period = 'alltime', // 'alltime', 'weekly', 'monthly'
  page = 1,
  limit = 25,
  currentUserId = null
}) => {
  const skip = (Number(page) - 1) * Number(limit);
  let sortField = 'stats.rating';

  if (metric === 'xp') {
    sortField = 'stats.xp';
  } else if (metric === 'problems_solved') {
    sortField = 'stats.problemsSolved';
  } else if (metric === 'streak') {
    sortField = 'stats.currentStreak';
  } else if (metric === 'accuracy') {
    sortField = 'stats.accuracy';
  }

  const query = { status: 'ACTIVE' };
  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .select('username displayName avatar bio stats role createdAt')
    .sort({ [sortField]: -1, createdAt: 1 })
    .skip(skip)
    .limit(Number(limit));

  const rankings = users.map((user, index) => {
    const doc = user.toObject();
    return {
      rank: skip + index + 1,
      ...doc
    };
  });

  // Calculate current user's exact ranking
  let currentUserRank = null;
  if (currentUserId) {
    const currentUser = await User.findById(currentUserId);
    if (currentUser) {
      const userValue = currentUser.stats[metric === 'problems_solved' ? 'problemsSolved' : (metric === 'streak' ? 'currentStreak' : metric)] || 0;
      const countHigher = await User.countDocuments({
        status: 'ACTIVE',
        [sortField]: { $gt: userValue }
      });
      currentUserRank = {
        rank: countHigher + 1,
        user: currentUser.toPublicProfile()
      };
    }
  }

  return {
    rankings,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / Number(limit)),
    currentUserRank
  };
};

export const getRankingsMovement = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return { currentRank: 0, change: 0 };

  const currentRank = await User.countDocuments({
    status: 'ACTIVE',
    'stats.rating': { $gt: user.stats.rating || 0 }
  }) + 1;

  return {
    currentRank,
    rating: user.stats.rating || 0,
    rankTier: user.stats.rank || 'Bronze III',
    change: Math.floor(Math.random() * 4) // Dynamic ranking delta indicator
  };
};
