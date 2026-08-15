import { 
  RATING_REWARDS, 
  XP_REWARDS, 
  FIRST_SOLVE_BONUS_XP, 
  DAILY_CHALLENGE_BONUS_XP, 
  DAILY_CHALLENGE_BONUS_RATING,
  STREAK_BONUS_XP,
  LEVEL_FORMULA,
  RANK_TIERS
} from './constants.js';

export const calculateRating = ({ difficulty, attempts, timeTaken }) => {
  // V1: returns base rating from RATING_REWARDS
  return RATING_REWARDS[difficulty] || 0;
};

export const calculateXP = ({ difficulty, isFirstSolve, isDailyChallenge, streakDays }) => {
  let xp = XP_REWARDS[difficulty] || 0;
  if (isFirstSolve) xp += FIRST_SOLVE_BONUS_XP;
  if (isDailyChallenge) xp += DAILY_CHALLENGE_BONUS_XP;
  if (streakDays > 0) xp += STREAK_BONUS_XP;
  return xp;
};

export const calculateLevel = (totalXP) => {
  let level = 1;
  while (totalXP >= LEVEL_FORMULA(level)) {
    level++;
  }
  return level;
};

export const calculateRank = (rating) => {
  for (let i = 0; i < RANK_TIERS.length; i++) {
    const tier = RANK_TIERS[i];
    if (rating >= tier.minRating && rating <= tier.maxRating) {
      if (tier.name === 'Master') {
        return { name: tier.name, tier: i + 1, subdivision: 'I', fullName: 'Master I' };
      }
      const range = tier.maxRating - tier.minRating + 1;
      const subdivisionSize = range / tier.subdivisions.length;
      const relativeRating = rating - tier.minRating;
      const subdivisionIndex = Math.min(
        Math.floor(relativeRating / subdivisionSize),
        tier.subdivisions.length - 1
      );
      const subdivision = tier.subdivisions[subdivisionIndex];
      return { 
        name: tier.name, 
        tier: i + 1, 
        subdivision, 
        fullName: `${tier.name} ${subdivision}` 
      };
    }
  }
  return { name: 'Bronze', tier: 1, subdivision: 'III', fullName: 'Bronze III' };
};

export const getNextLevelXP = (currentLevel) => {
  return LEVEL_FORMULA(currentLevel);
};

export const getLevelProgress = (totalXP) => {
  const level = calculateLevel(totalXP);
  const currentLevelBaseXP = level > 1 ? LEVEL_FORMULA(level - 1) : 0;
  const nextLevelXP = LEVEL_FORMULA(level);
  
  const currentXP = totalXP - currentLevelBaseXP;
  const requiredXP = nextLevelXP - currentLevelBaseXP;
  
  const progress = requiredXP > 0 ? (currentXP / requiredXP) * 100 : 100;
  
  return {
    level,
    currentXP,
    nextLevelXP,
    progress: Math.min(Math.max(progress, 0), 100)
  };
};
