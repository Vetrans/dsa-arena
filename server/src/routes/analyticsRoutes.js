import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/personal', authenticate, analyticsController.getPersonalAnalytics);

export default router;
