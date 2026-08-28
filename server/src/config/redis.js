import { createClient } from 'redis';
import { env } from './env.js';
import { logger } from './logger.js';

export const redis = createClient({ url: env.REDIS_URL, socket: { reconnectStrategy: (retries) => Math.min(retries * 100, 3000) } });
redis.on('error', (err) => logger.error({ err }, 'Redis client error'));

export async function connectRedis() {
  if (!redis.isOpen) await redis.connect();
  await redis.ping();
  logger.info('Redis connected');
}

export async function closeRedis() {
  if (redis.isOpen) await redis.quit();
}
