import { Router } from 'express';
import mongoose from 'mongoose';
import { redis } from '../config/redis.js';

const router = Router();
router.get('/live', (req, res) => res.status(200).json({ status: 'ok' }));
router.get('/ready', async (req, res) => {
  const mongoReady = mongoose.connection.readyState === 1;
  const redisReady = redis.isReady;
  if (!mongoReady || !redisReady) return res.status(503).json({ status: 'unavailable', dependencies: { mongoReady, redisReady } });
  return res.status(200).json({ status: 'ok', dependencies: { mongoReady, redisReady } });
});
export default router;
