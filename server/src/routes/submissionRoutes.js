import express from 'express';
import * as submissionController from '../controllers/submissionController.js';
import { authenticate } from '../middlewares/auth.js';
import { submissionLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/run', submissionLimiter, submissionController.runCode);
router.post('/', authenticate, submissionLimiter, submissionController.submitSolution);
router.get('/history', authenticate, submissionController.getSubmissions);
router.get('/:id/events', authenticate, submissionController.getSubmissionEvents);
router.get('/:id', authenticate, submissionController.getSubmissionById);

export default router;

