export const RATING_REWARDS = { Easy: 10, Medium: 25, Hard: 50 };
export const XP_REWARDS = { Easy: 10, Medium: 25, Hard: 50 };

export const FIRST_SOLVE_BONUS_XP = 5;
export const DAILY_CHALLENGE_BONUS_XP = 15;
export const DAILY_CHALLENGE_BONUS_RATING = 10;
export const STREAK_BONUS_XP = 5;

export const LEVEL_FORMULA = (level) => Math.floor(50 * level * level + 50 * level);

export const RANK_TIERS = [
  { name: 'Bronze', minRating: 0, maxRating: 499, subdivisions: ['III', 'II', 'I'] },
  { name: 'Silver', minRating: 500, maxRating: 999, subdivisions: ['III', 'II', 'I'] },
  { name: 'Gold', minRating: 1000, maxRating: 1499, subdivisions: ['III', 'II', 'I'] },
  { name: 'Platinum', minRating: 1500, maxRating: 1999, subdivisions: ['III', 'II', 'I'] },
  { name: 'Diamond', minRating: 2000, maxRating: 2499, subdivisions: ['III', 'II', 'I'] },
  { name: 'Master', minRating: 2500, maxRating: Infinity, subdivisions: ['III', 'II', 'I'] },
];

export const USER_ROLES = ['USER', 'MODERATOR', 'ADMIN'];
export const PROBLEM_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
export const SUBMISSION_STATUSES = [
  'QUEUED', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED',
  'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'SYSTEM_ERROR'
];

export const SUPPORTED_LANGUAGES = ['cpp', 'python', 'javascript'];

export const TOPICS = [
  'Arrays', 'Strings', 'Linked Lists', 'Stack', 'Queue', 'Hashing', 'Trees',
  'Graphs', 'Recursion', 'Backtracking', 'Sorting', 'Searching', 'Greedy',
  'Dynamic Programming', 'Bit Manipulation', 'Heaps', 'Sliding Window',
  'Two Pointers', 'Prefix Sum', 'Math'
];
