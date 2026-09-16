import { Problem, Topic, User } from '../models/index.js';
import { logger } from '../config/logger.js';
import { TOPICS_DATA } from './index.js';
import { PROBLEMS_1_18 } from './problems1_18.js';
import { PROBLEMS_19_200 } from './problems19_200.js';

export const ensureAllProblemsExist = async () => {
  try {
    // 1. Ensure all topics exist in MongoDB
    const topicMap = {};
    for (const t of TOPICS_DATA) {
      let topicDoc = await Topic.findOne({ slug: t.slug });
      if (!topicDoc) {
        topicDoc = await Topic.create(t);
      }
      topicMap[t.slug] = topicDoc._id;
    }

    // 2. Ensure an Admin user exists to author the problems
    let adminUser = await User.findOne({ role: 'ADMIN' });
    if (!adminUser) {
      adminUser = await User.create({
        username: 'nycadmins',
        email: process.env.INITIAL_ADMIN_EMAIL || 'admin@nycdsaarena.com',
        passwordHash: process.env.INITIAL_ADMIN_PASSWORD || 'Admin@123456',
        displayName: 'Arena Director',
        bio: 'NYC DSA Arena Official System Administrator.',
        role: 'ADMIN',
        stats: {
          rating: 1500,
          xp: 0,
          level: 1,
          rank: 'Gold I',
          problemsSolved: 0,
          currentStreak: 0
        }
      });
    }

    // 3. Assemble full 200-problem catalog (1 to 200)
    const allProblems = [...PROBLEMS_1_18, ...PROBLEMS_19_200];

    // 4. Bulk upsert all 200 problems to ensure complete parity and integrity
    const bulkOps = allProblems.map((p) => {
      const topicIds = (p.topicSlugs || []).map((slug) => topicMap[slug]).filter(Boolean);
      return {
        updateOne: {
          filter: { problemNumber: p.problemNumber },
          update: {
            $set: {
              ...p,
              topics: topicIds,
              author: adminUser._id,
              status: 'PUBLISHED'
            }
          },
          upsert: true
        }
      };
    });

    if (bulkOps.length > 0) {
      const result = await Problem.bulkWrite(bulkOps, { ordered: false });
      logger.info(
        { matched: result.matchedCount, upserted: result.upsertedCount, modified: result.modifiedCount },
        'Synchronized full 200 DSA problems in MongoDB.'
      );
    }

    // 5. Synchronize topic problem counts
    const allTopics = await Topic.find({});
    for (const t of allTopics) {
      const count = await Problem.countDocuments({ topics: t._id, status: 'PUBLISHED' });
      await Topic.findByIdAndUpdate(t._id, { problemCount: count });
    }

    const totalCount = await Problem.countDocuments({ status: 'PUBLISHED' });
    logger.info({ totalProblems: totalCount }, 'DSA Problem Vault is dynamically synced in MongoDB.');
  } catch (err) {
    logger.error({ err }, 'Error during ensureAllProblemsExist synchronization');
  }
};
