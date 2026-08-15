import express from 'express';
import { getProfile, updateProfile, getUserByUsername, searchUsers } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/:username', getUserByUsername);

export default router;
