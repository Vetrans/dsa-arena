import express from 'express';
import * as discussionController from '../controllers/discussionController.js';
import { authenticate, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', optionalAuth, discussionController.getDiscussions);
router.post('/', authenticate, discussionController.createComment);
router.post('/:id/vote', authenticate, discussionController.voteComment);
router.delete('/:id', authenticate, discussionController.deleteComment);

export default router;
