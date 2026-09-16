import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Enforce Admin auth for all routes in this router
router.use(authenticate, requireRole('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/suspend', adminController.toggleUserSuspend);
router.post('/users/:id/points', adminController.grantUserPoints);
router.post('/users/:id/warn', adminController.warnUser);
router.post('/users/:id/clear-warnings', adminController.clearWarnings);
router.delete('/users/:id', adminController.deleteUser);
router.get('/feedback', adminController.getFeedback);
router.put('/feedback/:id', adminController.updateFeedbackStatus);

export default router;
