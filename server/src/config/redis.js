import { createClient } from 'redis';
import { env } from './env.js';
import { logger } from './logger.js';

export let redisAvailable = false;
export const redis = createClient({ url: env.REDIS_URL, socket: { reconnectStrategy: false } });
redis.on('error', (err) => logger.error({ err }, 'Redis client error'));

export async function connectRedis() {
  try {
    if (!redis.isOpen) await redis.connect();
    await redis.ping();
    redisAvailable = true;
    logger.info('Redis connected');
  } catch (err) {
    if (env.NODE_ENV === 'production') throw err;
    logger.warn('Redis is unavailable; using process-local rate limits for development only');
  }
}

export async function closeRedis() {
  if (redis.isOpen) await redis.quit();
}
