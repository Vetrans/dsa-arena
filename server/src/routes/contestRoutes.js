import { Router } from 'express';
import * as contestController from '../controllers/contestController.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', contestController.getContests);
router.get('/:slug', contestController.getContest);
router.post('/', authenticate, requireRole('ADMIN'), contestController.createContest);
router.post('/:slug/register', authenticate, contestController.registerContest);
router.delete('/:slug', authenticate, requireRole('ADMIN'), contestController.deleteContest);

export default router;

