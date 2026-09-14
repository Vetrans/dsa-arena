import { Queue, Worker } from 'bullmq';
import { env } from '../config/env.js';
import { redisAvailable } from '../config/redis.js';
import { getTodayDailyChallenge } from '../services/dailyChallengeService.js';
import { User, Streak } from '../models/index.js';
import { logger } from '../config/logger.js';

let cronQueue = null;
let cronWorker = null;

export const setupDistributedScheduler = async () => {
  if (!redisAvailable) {
    logger.info('Redis not active; skipping BullMQ distributed cron scheduler');
    return;
  }

  try {
    const redisUrl = new URL(env.REDIS_URL);
    const connection = {
      host: redisUrl.hostname || '127.0.0.1',
      port: parseInt(redisUrl.port || '6379', 10),
      password: redisUrl.password || undefined,
      maxRetriesPerRequest: null
    };

    cronQueue = new Queue('distributed-crons', { connection });

    // 1. Daily Challenge Rollover at 00:00 UTC
    await cronQueue.add(
      'daily-challenge-rollover',
      { type: 'DAILY_CHALLENGE' },
      {
        repeat: {
          pattern: '0 0 * * *' // Midnight UTC every day
        },
        removeOnComplete: 20,
        removeOnFail: 50
      }
    );

    // 2. Midnight Streak Reset & Audit at 00:05 UTC
    await cronQueue.add(
      'streak-audit-and-reset',
      { type: 'STREAK_AUDIT' },
      {
        repeat: {
          pattern: '5 0 * * *'
        },
        removeOnComplete: 20,
        removeOnFail: 50
      }
    );

    // Distributed Worker: Executes exactly once across any number of server nodes
    cronWorker = new Worker(
      'distributed-crons',
      async (job) => {
        logger.info({ jobName: job.name, jobId: job.id }, 'Executing distributed repeatable cron job');

        if (job.name === 'daily-challenge-rollover') {
          // Trigger daily challenge initialization
          const challenge = await getTodayDailyChallenge();
          logger.info({ challengeDate: challenge?.date }, 'Distributed daily challenge rolled over successfully');
          return { success: true, date: challenge?.date };
        }

        if (job.name === 'streak-audit-and-reset') {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          // Check active users whose last active day was older than yesterday
          const inactiveUsers = await User.find({
            status: 'ACTIVE',
            'stats.currentStreak': { $gt: 0 }
          }).select('_id stats');

          let resetCount = 0;
          for (const u of inactiveUsers) {
            const hadYesterday = await Streak.exists({ userId: u._id, date: yesterdayStr });
            if (!hadYesterday) {
              u.stats.currentStreak = 0;
              await u.save({ validateBeforeSave: false });
              resetCount++;
            }
          }

          logger.info({ resetCount }, 'Distributed streak audit completed');
          return { success: true, resetCount };
        }
      },
      { connection }
    );

    cronWorker.on('completed', (job) => {
      logger.info({ jobId: job.id, name: job.name }, 'Distributed cron completed successfully');
    });

    cronWorker.on('failed', (job, err) => {
      logger.error({ jobId: job?.id, err }, 'Distributed cron failed');
    });

    logger.info('BullMQ Distributed Repeatable Scheduler initialized successfully');
  } catch (err) {
    logger.warn({ err }, 'Failed to initialize BullMQ distributed scheduler');
  }
};
