import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis.js';
const createLimiter = (prefix, windowMs, limit) => rateLimit({ windowMs, limit, standardHeaders: 'draft-7', legacyHeaders: false, store: new RedisStore({ prefix: `rl:${prefix}:`, sendCommand: (...args) => redis.sendCommand(args) }), handler: (req, res) => res.status(429).json({ success: false, code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' }) });
export const authLimiter = createLimiter('auth', 15 * 60 * 1000, 20);
export const apiLimiter = createLimiter('api', 15 * 60 * 1000, 300);
export const submissionLimiter = createLimiter('submission', 60 * 1000, 10);
