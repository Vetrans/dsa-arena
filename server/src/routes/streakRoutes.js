import express from 'express';
import * as streakController from '../controllers/streakController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/current', authenticate, streakController.getStreak);

export default router;
