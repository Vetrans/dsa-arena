import express from 'express';
import * as leaderboardController from '../controllers/leaderboardController.js';
import { optionalAuth, authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', optionalAuth, leaderboardController.getLeaderboard);
router.get('/movement', authenticate, leaderboardController.getRankingsMovement);

export default router;
