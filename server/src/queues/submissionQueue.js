import { Queue } from 'bullmq';
import { env } from '../config/env.js';
import { redisAvailable } from '../config/redis.js';
import { logger } from '../config/logger.js';

let submissionQueue = null;

export const getSubmissionQueue = () => {
  if (!submissionQueue && redisAvailable) {
    try {
      const redisUrl = new URL(env.REDIS_URL);
      const connection = {
        host: redisUrl.hostname || '127.0.0.1',
        port: parseInt(redisUrl.port || '6379', 10),
        password: redisUrl.password || undefined
      };

      submissionQueue = new Queue('submission-evaluations', {
        connection,
        defaultJobOptions: {
          attempts: 2,
          backoff: {
            type: 'exponential',
            delay: 1000
          },
          removeOnComplete: 100,
          removeOnFail: 500
        }
      });

      logger.info('BullMQ submission queue initialized');
    } catch (err) {
      logger.warn({ err }, 'Failed to initialize BullMQ submission queue');
    }
  }
  return submissionQueue;
};

export const queueSubmissionEvaluation = async (submissionJobData) => {
  const queue = getSubmissionQueue();
  if (queue) {
    return await queue.add('evaluate-code', submissionJobData);
  }
  return null;
};
