import { Router } from 'express';
import * as contestController from '../controllers/contestController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', contestController.getContests);
router.get('/:slug', contestController.getContest);
router.post('/', requireAuth, requireRole(['admin']), contestController.createContest);
router.post('/:slug/register', requireAuth, contestController.registerContest);
router.delete('/:slug', requireAuth, requireRole(['admin']), contestController.deleteContest);

export default router;
