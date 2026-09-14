import { Worker } from 'bullmq';
import { env } from '../config/env.js';
import { processSubmissionExecution } from '../services/submissionService.js';
import { logger } from '../config/logger.js';

let judgeWorker = null;

export const startJudgeWorker = (concurrency = 5) => {
  try {
    const redisUrl = new URL(env.REDIS_URL);
    const connection = {
      host: redisUrl.hostname || '127.0.0.1',
      port: parseInt(redisUrl.port || '6379', 10),
      password: redisUrl.password || undefined,
      maxRetriesPerRequest: null
    };

    judgeWorker = new Worker(
      'submission-evaluations',
      async (job) => {
        const { submissionId, userId, problemId, code, language } = job.data;
        logger.info({ jobId: job.id, submissionId }, 'Judge worker processing submission in isolated sandbox');

        return await processSubmissionExecution({
          submissionId,
          userId,
          problemId,
          code,
          language
        });
      },
      {
        connection,
        concurrency,
        limiter: {
          max: 100,
          duration: 1000
        }
      }
    );

    judgeWorker.on('completed', (job) => {
      logger.info({ jobId: job.id }, 'Submission evaluation completed successfully');
    });

    judgeWorker.on('failed', (job, err) => {
      logger.error({ jobId: job?.id, err }, 'Submission evaluation failed in worker');
    });

    logger.info({ concurrency }, 'Judge BullMQ Worker started');
    return judgeWorker;
  } catch (err) {
    logger.warn({ err }, 'Failed to start Judge Worker');
    return null;
  }
};

