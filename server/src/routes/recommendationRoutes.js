import express from 'express';
import * as recommendationController from '../controllers/recommendationController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, recommendationController.getRecommendations);

export default router;
