import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      readPreference: 'secondaryPreferred'
    });
    logger.info({ host: conn.connection.host }, 'MongoDB connected');

  } catch (error) {
    logger.error({ err: error }, 'MongoDB connection failed');
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB connection error');
});
