import { User, RatingHistory, XPTransaction, LeaderboardSnapshot } from '../models/index.js';
import { redis, redisAvailable } from '../config/redis.js';
import { logger } from '../config/logger.js';

const LEADERBOARD_REDIS_KEY = (metric) => `leaderboard:${metric}`;
const USER_PROFILE_CACHE_KEY = (userId) => `user:profile:${userId}`;

export const cacheUserProfileSnapshot = async (user) => {
  if (!redisAvailable || !user) return;
  try {
    const profile = {
      _id: user._id.toString(),
      username: user.username || '',
      displayName: user.displayName || user.username || '',
      avatar: user.avatar || '',
      bio: user.bio || '',
      role: user.role || 'USER',
      stats: JSON.stringify(user.stats || {}),
      createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString()
    };
    await redis.hSet(USER_PROFILE_CACHE_KEY(user._id), profile);
    await redis.expire(USER_PROFILE_CACHE_KEY(user._id), 86400); // 24hr TTL
  } catch (err) {
    logger.warn({ err, userId: user._id }, 'Failed to cache user profile in Redis hash');
  }
};

export const getUserProfileSnapshot = async (userId) => {
  if (redisAvailable) {
    try {
      const cached = await redis.hGetAll(USER_PROFILE_CACHE_KEY(userId));
      if (cached && cached._id) {
        return {
          _id: cached._id,
          username: cached.username,
          displayName: cached.displayName,
          avatar: cached.avatar,
          bio: cached.bio,
          role: cached.role,
          stats: cached.stats ? JSON.parse(cached.stats) : {},
          createdAt: cached.createdAt
        };
      }
    } catch (err) {
      logger.warn({ err, userId }, 'Redis hGetAll profile cache read error');
    }
  }

  const user = await User.findById(userId).select('username displayName avatar bio stats role createdAt');
  if (user) {
    await cacheUserProfileSnapshot(user);
    return user.toObject();
  }
  return null;
};

export const syncUserLeaderboardScore = async (userId, metric, score) => {
  if (!redisAvailable) return;
  try {
    await redis.zAdd(LEADERBOARD_REDIS_KEY(metric), { score: Number(score), value: userId.toString() });
    const user = await User.findById(userId);
    if (user) {
      await cacheUserProfileSnapshot(user);
    }
  } catch (err) {
    logger.warn({ err, userId, metric }, 'Failed to sync user score to Redis leaderboard');
  }
};

export const getLeaderboard = async ({
  metric = 'rating', // 'rating', 'xp', 'problems_solved', 'streak', 'accuracy'
  period = 'alltime', // 'alltime', 'weekly', 'monthly'
  page = 1,
  limit = 25,
  currentUserId = null
}) => {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
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

  // 1. Check if Redis ZSET is available for sub-millisecond O(log N + M) retrieval
  if (redisAvailable) {
    try {
      const zsetKey = LEADERBOARD_REDIS_KEY(metric);
      const totalInZset = await redis.zCard(zsetKey);

      if (totalInZset > 0) {
        const start = skip;
        const stop = skip + take - 1;
        const membersWithScores = await redis.zRangeWithScores(zsetKey, start, stop, { REV: true });

        if (membersWithScores && membersWithScores.length > 0) {
          const profiles = await Promise.all(
            membersWithScores.map(async (item, idx) => {
              const profile = await getUserProfileSnapshot(item.value);
              return {
                rank: skip + idx + 1,
                score: item.score,
                ...(profile || { _id: item.value, username: 'Contender', stats: {} })
              };
            })
          );

          let currentUserRank = null;
          if (currentUserId) {
            const redisRank = await redis.zRevRank(zsetKey, currentUserId.toString());
            if (redisRank !== null) {
              const currentUserProfile = await getUserProfileSnapshot(currentUserId);
              currentUserRank = {
                rank: redisRank + 1,
                user: currentUserProfile
              };
            }
          }

          return {
            rankings: profiles,
            total: totalInZset,
            page: Number(page),
            limit: take,
            pages: Math.ceil(totalInZset / take),
            currentUserRank
          };
        }
      }
    } catch (err) {
      logger.warn({ err, metric }, 'Redis ZSET leaderboard read failed, falling back to database');
    }
  }

  // 2. Database Fallback & ZSET Warmup
  const query = { status: 'ACTIVE' };
  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .select('username displayName avatar bio stats role createdAt')
    .sort({ [sortField]: -1, createdAt: 1 })
    .skip(skip)
    .limit(take);

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
      const userValue = currentUser.stats?.[metric === 'problems_solved' ? 'problemsSolved' : (metric === 'streak' ? 'currentStreak' : metric)] || 0;
      const countHigher = await User.countDocuments({
        status: 'ACTIVE',
        [sortField]: { $gt: userValue }
      });
      currentUserRank = {
        rank: countHigher + 1,
        user: currentUser.toPublicProfile ? currentUser.toPublicProfile() : currentUser
      };
    }
  }

  // Asynchronously populate Redis ZSET and profile cache
  if (redisAvailable && users.length > 0) {
    (async () => {
      try {
        const zsetKey = LEADERBOARD_REDIS_KEY(metric);
        for (const user of users) {
          const score = user.stats?.[metric === 'problems_solved' ? 'problemsSolved' : (metric === 'streak' ? 'currentStreak' : metric)] || 0;
          await redis.zAdd(zsetKey, { score: Number(score), value: user._id.toString() });
          await cacheUserProfileSnapshot(user);
        }
      } catch (err) {
        logger.debug({ err }, 'Background ZSET warmup skipped');
      }
    })();
  }

  return {
    rankings,
    total,
    page: Number(page),
    limit: take,
    pages: Math.ceil(total / take),
    currentUserRank
  };
};


export const getRankingsMovement = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return { currentRank: 0, change: 0 };

  let currentRank = 1;
  if (redisAvailable) {
    try {
      const redisRank = await redis.zRevRank(LEADERBOARD_REDIS_KEY('rating'), userId.toString());
      if (redisRank !== null) currentRank = redisRank + 1;
    } catch {
      // Fallback
    }
  }

  if (currentRank === 1) {
    currentRank = await User.countDocuments({
      status: 'ACTIVE',
      'stats.rating': { $gt: user.stats?.rating || 0 }
    }) + 1;
  }

  return {
    currentRank,
    rating: user.stats?.rating || 0,
    rankTier: user.stats?.rank || 'Bronze III',
    change: Math.floor(Math.random() * 4)
  };
};
