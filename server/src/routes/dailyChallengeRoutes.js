import express from 'express';
import * as dailyChallengeController from '../controllers/dailyChallengeController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', optionalAuth, dailyChallengeController.getDailyChallenge);

export default router;
