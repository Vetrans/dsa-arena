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
    logger.info('Redis connected successfully');
  } catch (err) {
    if (env.NODE_ENV === 'production') throw err;
    logger.warn('Redis is unavailable; using in-memory fallbacks for development');
    redisAvailable = false;
  }
}

export async function createDuplicateClient() {
  if (!redisAvailable) return null;
  const duplicate = redis.duplicate();
  await duplicate.connect();
  return duplicate;
}

export async function closeRedis() {
  if (redis.isOpen) await redis.quit();
}

/**
 * Cache Helpers with TTL
 */
export async function getCache(key) {
  if (!redisAvailable) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.warn({ err, key }, 'Redis getCache error');
    return null;
  }
}

export async function setCache(key, value, ttlSeconds = 300) {
  if (!redisAvailable) return;
  try {
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    logger.warn({ err, key }, 'Redis setCache error');
  }
}

export async function delCache(key) {
  if (!redisAvailable) return;
  try {
    await redis.del(key);
  } catch (err) {
    logger.warn({ err, key }, 'Redis delCache error');
  }
}
