import express from 'express';
import * as achievementController from '../controllers/achievementController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', optionalAuth, achievementController.getAchievements);

export default router;
