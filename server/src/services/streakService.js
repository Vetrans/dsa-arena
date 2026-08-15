import { Streak, User } from '../models/index.js';

const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

const getYesterdayString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export const recordDailyActivity = async (userId, problemsSolved = 1, xpEarned = 0) => {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  // Find or create today's streak entry
  let todayStreak = await Streak.findOne({ userId, date: today });
  const isFirstToday = !todayStreak;

  if (todayStreak) {
    todayStreak.problemsSolved += problemsSolved;
    todayStreak.xpEarned += xpEarned;
    await todayStreak.save();
  } else {
    todayStreak = await Streak.create({
      userId,
      date: today,
      problemsSolved,
      xpEarned
    });
  }

  // Update user's aggregate streak count if this is the first activity today
  if (isFirstToday) {
    const yesterdayStreak = await Streak.findOne({ userId, date: yesterday });
    const user = await User.findById(userId);

    let newCurrentStreak = 1;
    if (yesterdayStreak) {
      newCurrentStreak = (user.stats.currentStreak || 0) + 1;
    }

    const longestStreak = Math.max(user.stats.longestStreak || 0, newCurrentStreak);

    user.stats.currentStreak = newCurrentStreak;
    user.stats.longestStreak = longestStreak;
    await user.save({ validateBeforeSave: false });

    return {
      currentStreak: newCurrentStreak,
      longestStreak,
      isNewStreakDay: true
    };
  }

  const user = await User.findById(userId);
  return {
    currentStreak: user.stats.currentStreak,
    longestStreak: user.stats.longestStreak,
    isNewStreakDay: false
  };
};

export const getUserStreakInfo = async (userId) => {
  const user = await User.findById(userId);
  const today = getTodayString();
  const todayActivity = await Streak.findOne({ userId, date: today });

  const history = await Streak.find({ userId })
    .sort({ date: -1 })
    .limit(365);

  return {
    currentStreak: user.stats.currentStreak || 0,
    longestStreak: user.stats.longestStreak || 0,
    activeToday: !!todayActivity,
    history
  };
};
