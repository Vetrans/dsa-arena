import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { error } from './utils/apiResponse.js';
import { env } from './config/env.js';
import { requestContext } from './middlewares/requestContext.js';
import healthRoutes from './routes/healthRoutes.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import streakRoutes from './routes/streakRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import dailyChallengeRoutes from './routes/dailyChallengeRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.set('trust proxy', 1);
app.use(requestContext);

// Security & Optimization Middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(compression());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/health', healthRoutes);

// Rate limiting
app.use('/api', apiLimiter);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/auth', authRoutes); // Temporary compatibility route; remove after client migration.
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/rankings', leaderboardRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/daily-challenge', dailyChallengeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res, next) => {
  return error(res, `API route not found: ${req.method} ${req.originalUrl}`, 404);
});

// Error handler
app.use(errorHandler);

export default app;
