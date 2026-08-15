import { Achievement, UserAchievement, XPTransaction, Notification, User } from '../models/index.js';

export const checkAndUnlockAchievements = async (user, context = {}) => {
  const userId = user._id;
  const newlyUnlocked = [];

  // Get all active achievements
  const allAchievements = await Achievement.find({ isActive: true });
  
  // Get already unlocked achievement IDs
  const unlockedRecords = await UserAchievement.find({ userId });
  const unlockedMap = new Set(unlockedRecords.map(r => r.achievementId.toString()));

  for (const achievement of allAchievements) {
    if (unlockedMap.has(achievement._id.toString())) {
      continue; // Already unlocked
    }

    let isEligible = false;
    const cond = achievement.condition || {};

    switch (cond.type) {
      case 'problems_solved':
        if ((user.stats.problemsSolved || 0) >= cond.threshold) {
          isEligible = true;
        }
        break;
      case 'easy_solved':
        if ((user.stats.easySolved || 0) >= cond.threshold) {
          isEligible = true;
        }
        break;
      case 'medium_solved':
        if ((user.stats.mediumSolved || 0) >= cond.threshold) {
          isEligible = true;
        }
        break;
      case 'hard_solved':
        if ((user.stats.hardSolved || 0) >= cond.threshold) {
          isEligible = true;
        }
        break;
      case 'streak_days':
        if ((user.stats.currentStreak || 0) >= cond.threshold || (user.stats.longestStreak || 0) >= cond.threshold) {
          isEligible = true;
        }
        break;
      case 'rating_reached':
        if ((user.stats.rating || 0) >= cond.threshold) {
          isEligible = true;
        }
        break;
      default:
        break;
    }

    if (isEligible) {
      // Record user achievement
      const userAch = await UserAchievement.create({
        userId,
        achievementId: achievement._id,
        progress: 100,
        unlockedAt: new Date()
      });

      // Grant XP reward if any
      if (achievement.xpReward > 0) {
        user.stats.xp = (user.stats.xp || 0) + achievement.xpReward;
        await XPTransaction.create({
          userId,
          amount: achievement.xpReward,
          newTotal: user.stats.xp,
          reason: `Achievement Unlocked: ${achievement.name}`,
          source: achievement._id.toString(),
          sourceType: 'achievement'
        });
      }

      // Create notification
      await Notification.create({
        userId,
        type: 'ACHIEVEMENT',
        title: `🏆 Achievement Unlocked!`,
        message: `You earned the "${achievement.name}" badge and +${achievement.xpReward} XP!`,
        link: '/achievements',
        metadata: { achievementId: achievement._id }
      });

      newlyUnlocked.push({
        _id: achievement._id,
        key: achievement.key,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        xpReward: achievement.xpReward,
        rarity: achievement.rarity
      });
    }
  }

  if (newlyUnlocked.length > 0) {
    await user.save({ validateBeforeSave: false });
  }

  return newlyUnlocked;
};

export const getAllAchievements = async (userId = null) => {
  const achievements = await Achievement.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  
  if (!userId) {
    return achievements.map(a => ({
      ...a.toObject(),
      isUnlocked: false,
      progress: 0
    }));
  }

  const userAchievements = await UserAchievement.find({ userId });
  const unlockedMap = new Map(userAchievements.map(ua => [ua.achievementId.toString(), ua]));

  return achievements.map(a => {
    const ua = unlockedMap.get(a._id.toString());
    return {
      ...a.toObject(),
      isUnlocked: !!ua,
      unlockedAt: ua ? ua.unlockedAt : null,
      progress: ua ? ua.progress : 0
    };
  });
};
