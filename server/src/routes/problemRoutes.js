import express from 'express';
import * as problemController from '../controllers/problemController.js';
import { authenticate, optionalAuth, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Public / Optional Auth routes
router.get('/', optionalAuth, problemController.getProblems);
router.get('/:slug', optionalAuth, problemController.getProblemBySlug);
router.get('/:slug/hints', optionalAuth, problemController.getProblemHints);
router.get('/:slug/editorial', optionalAuth, problemController.getProblemEditorial);
router.get('/:id/feedback-stats', problemController.getProblemFeedbackStats);

// Admin problem management
router.post('/', authenticate, requireRole('ADMIN', 'MODERATOR'), problemController.createProblem);
router.put('/:id', authenticate, requireRole('ADMIN', 'MODERATOR'), problemController.updateProblem);
router.delete('/:id', authenticate, requireRole('ADMIN'), problemController.deleteProblem);

export default router;
