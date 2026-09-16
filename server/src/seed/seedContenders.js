import { User } from '../models/index.js';
import { logger } from '../config/logger.js';

export const SEED_CONTENDERS = [
  {
    username: 'siddharth_algo',
    email: 'siddharth@nycdsa.com',
    displayName: 'Siddharth Sharma',
    bio: 'Competitive programmer | Quantitative developer NYC',
    stats: { rating: 2420, xp: 8850, level: 36, rank: 'Master', problemsSolved: 52, easySolved: 18, mediumSolved: 22, hardSolved: 12, totalSubmissions: 78, acceptedSubmissions: 64, accuracy: 82, currentStreak: 18, longestStreak: 25 }
  },
  {
    username: 'elena_k',
    email: 'elena@nycdsa.com',
    displayName: 'Elena Rostova',
    bio: 'Distributed systems engineer | Algorithms enthusiast',
    stats: { rating: 2280, xp: 7400, level: 30, rank: 'Master', problemsSolved: 46, easySolved: 16, mediumSolved: 20, hardSolved: 10, totalSubmissions: 65, acceptedSubmissions: 54, accuracy: 83, currentStreak: 14, longestStreak: 21 }
  },
  {
    username: 'marcus_dev',
    email: 'marcus@nycdsa.com',
    displayName: 'Marcus Vance',
    bio: 'Brooklyn tech founder | Graph algorithms specialist',
    stats: { rating: 2150, xp: 6200, level: 25, rank: 'Master', problemsSolved: 39, easySolved: 14, mediumSolved: 17, hardSolved: 8, totalSubmissions: 55, acceptedSubmissions: 45, accuracy: 81, currentStreak: 12, longestStreak: 18 }
  },
  {
    username: 'chloe_ny',
    email: 'chloe@nycdsa.com',
    displayName: 'Chloe Zhang',
    bio: 'FinTech algorithm specialist | Manhattan',
    stats: { rating: 1980, xp: 5100, level: 21, rank: 'Diamond I', problemsSolved: 33, easySolved: 12, mediumSolved: 15, hardSolved: 6, totalSubmissions: 48, acceptedSubmissions: 38, accuracy: 79, currentStreak: 9, longestStreak: 15 }
  },
  {
    username: 'alex_code',
    email: 'alex@nycdsa.com',
    displayName: 'Alex River',
    bio: 'Fullstack builder & DSA grinder | Queens',
    stats: { rating: 1840, xp: 4300, level: 18, rank: 'Platinum II', problemsSolved: 28, easySolved: 11, mediumSolved: 13, hardSolved: 4, totalSubmissions: 42, acceptedSubmissions: 32, accuracy: 76, currentStreak: 7, longestStreak: 14 }
  },
  {
    username: 'dev_priya',
    email: 'priya@nycdsa.com',
    displayName: 'Priya Patel',
    bio: 'Systems software engineer | Dynamic programming lover',
    stats: { rating: 1720, xp: 3600, level: 15, rank: 'Platinum III', problemsSolved: 22, easySolved: 10, mediumSolved: 10, hardSolved: 2, totalSubmissions: 35, acceptedSubmissions: 26, accuracy: 74, currentStreak: 5, longestStreak: 10 }
  },
  {
    username: 'hassan_algo',
    email: 'hassan@nycdsa.com',
    displayName: 'Hassan Al-Mansoor',
    bio: 'CS Researcher at Columbia | Tree traversal fan',
    stats: { rating: 1610, xp: 2900, level: 12, rank: 'Gold I', problemsSolved: 19, easySolved: 9, mediumSolved: 8, hardSolved: 2, totalSubmissions: 30, acceptedSubmissions: 22, accuracy: 73, currentStreak: 4, longestStreak: 8 }
  },
  {
    username: 'kenji_s',
    email: 'kenji@nycdsa.com',
    displayName: 'Kenji Sato',
    bio: 'Frontend architect diving deep into LeetCode patterns',
    stats: { rating: 1490, xp: 2100, level: 9, rank: 'Gold II', problemsSolved: 15, easySolved: 8, mediumSolved: 6, hardSolved: 1, totalSubmissions: 25, acceptedSubmissions: 17, accuracy: 68, currentStreak: 3, longestStreak: 7 }
  },
  {
    username: 'maya_lin',
    email: 'maya@nycdsa.com',
    displayName: 'Maya Lin',
    bio: 'Junior Software Engineer | NYU Tandon alum',
    stats: { rating: 1380, xp: 1600, level: 7, rank: 'Silver I', problemsSolved: 11, easySolved: 7, mediumSolved: 4, hardSolved: 0, totalSubmissions: 20, acceptedSubmissions: 13, accuracy: 65, currentStreak: 2, longestStreak: 5 }
  },
  {
    username: 'jordan_b',
    email: 'jordan@nycdsa.com',
    displayName: 'Jordan Bell',
    bio: 'Bootcamp grad sharpening algorithmic problem solving',
    stats: { rating: 1250, xp: 950, level: 4, rank: 'Silver III', problemsSolved: 7, easySolved: 5, mediumSolved: 2, hardSolved: 0, totalSubmissions: 14, acceptedSubmissions: 8, accuracy: 57, currentStreak: 1, longestStreak: 3 }
  }
];

export const ensureTopContendersExist = async () => {
  try {
    const activeCount = await User.countDocuments({ status: 'ACTIVE' });
    if (activeCount >= 10) return;

    for (const c of SEED_CONTENDERS) {
      const existing = await User.findOne({
        $or: [{ username: c.username }, { email: c.email }]
      });
      if (!existing) {
        await User.create({
          ...c,
          passwordHash: 'Contender@123456',
          role: 'USER',
          status: 'ACTIVE',
          reputation: 'CLEAN'
        });
      }
    }
    logger.info('Ensured at least 10 active contenders exist in arena database');
  } catch (err) {
    logger.warn({ err }, 'Could not verify/seed default contenders');
  }
};
