import express from 'express';
import { register, login, refresh, getMe, logout, logoutAll } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/refresh', authLimiter, refresh);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);

export default router;
