import crypto from 'node:crypto';
import pinoHttp from 'pino-http';
import { logger } from '../config/logger.js';

export const requestContext = pinoHttp({
  logger,
  genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID(),
  customProps: (req) => ({ requestId: req.id }),
  redact: ['req.headers.authorization', 'req.headers.cookie'],
});
