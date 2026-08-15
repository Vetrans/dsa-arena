import express from 'express';
import * as feedbackController from '../controllers/feedbackController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, feedbackController.submitFeedback);

export default router;
