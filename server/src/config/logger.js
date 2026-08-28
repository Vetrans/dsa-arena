import pino from 'pino';
import { env } from './env.js';

export const logger = pino({
  level: process.env.LOG_LEVEL || (env.NODE_ENV === 'production' ? 'info' : 'debug'),
  base: { service: 'nyc-dsa-arena-api' },
  redact: ['req.headers.authorization', 'req.headers.cookie', 'password', 'passwordHash', 'refreshToken'],
});
