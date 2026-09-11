import http from 'http';
import mongoose from 'mongoose';
import { connectDB } from './src/config/db.js';
import { closeRedis, connectRedis } from './src/config/redis.js';
import { env } from './src/config/env.js';
import { logger } from './src/config/logger.js';
import { setupBattleSockets } from './src/sockets/battleSocket.js';

let server;
const shutdown = async (signal) => {
  logger.info({ signal }, 'Graceful shutdown started');
  if (server) await new Promise((resolve) => server.close(resolve));
  await Promise.allSettled([mongoose.disconnect(), closeRedis()]);
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => { logger.fatal({ err }, 'Uncaught exception'); shutdown('uncaughtException'); });
process.on('unhandledRejection', (err) => { logger.fatal({ err }, 'Unhandled rejection'); shutdown('unhandledRejection'); });

await connectDB();
await connectRedis();

const { default: app } = await import('./src/app.js');
const httpServer = http.createServer(app);
setupBattleSockets(httpServer);

server = httpServer.listen(env.PORT, () => {
  logger.info({ port: env.PORT, environment: env.NODE_ENV }, 'API & Real-time WebSocket server listening');
});
