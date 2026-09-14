import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Problem } from '../models/Problem.js';
import { User } from '../models/User.js';
import { RatingHistory } from '../models/RatingHistory.js';
import { evaluateSubmission } from '../services/judgeService.js';
import { MatchmakingService } from '../services/matchmakingService.js';
import { redis, redisAvailable, createDuplicateClient } from '../config/redis.js';
import { logger } from '../config/logger.js';

export const setupBattleSockets = async (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Enable Redis Adapter for horizontal Socket.IO multi-node clustering
  if (redisAvailable) {
    try {
      const subClient = await createDuplicateClient();
      if (subClient) {
        io.adapter(createAdapter(redis, subClient));
        logger.info('Socket.IO Redis adapter attached for distributed real-time scaling');
      }
    } catch (err) {
      logger.warn({ err }, 'Failed to initialize Socket.IO Redis adapter, falling back to standalone');
    }
  }

  io.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, 'Socket connected to Battle Arena');

    // 1. Join matchmaking queue
    socket.on('join_matchmaking', async (userData) => {
      try {
        const player = {
          socketId: socket.id,
          userId: userData?.userId || socket.id,
          username: userData?.username || `Warrior_${socket.id.slice(0, 4)}`,
          rating: Number(userData?.rating || 1200)
        };

        await MatchmakingService.enqueue(player);
        const opponent = await MatchmakingService.findOpponent(player);

        if (opponent) {
          const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          
          socket.join(roomId);
          const opponentSocket = io.sockets.sockets.get(opponent.socketId);
          if (opponentSocket) opponentSocket.join(roomId);

          // Fetch random curated problem from MongoDB
          let problem = await Problem.findOne({ isPublished: true, difficulty: { $in: ['Easy', 'Medium'] } }).lean();
          if (!problem) {
            problem = {
              slug: 'two-sum',
              title: 'Two Sum',
              difficulty: 'Easy',
              description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
              examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
              starterCode: {
                javascript: 'function twoSum(nums, target) {\n  // Write your solution here\n}'
              }
            };
          }

          const battleData = {
            roomId,
            player1: player,
            player2: opponent,
            problem,
            startTime: Date.now(),
            durationMs: 15 * 60 * 1000,
            status: 'IN_PROGRESS'
          };

          await MatchmakingService.setBattle(roomId, battleData);

          // Notify both players across cluster
          io.to(roomId).emit('match_found', {
            roomId,
            problem,
            players: [player, opponent],
            durationSeconds: 900
          });

          logger.info({ roomId, p1: player.username, p2: opponent.username }, '1v1 Battle initiated');
        } else {
          socket.emit('queue_joined', { message: 'Searching for an opponent with matching skill...' });
        }
      } catch (err) {
        logger.error({ err }, 'Error during matchmaking');
        socket.emit('error', { message: 'Failed to join matchmaking' });
      }
    });

    // 2. Cancel matchmaking
    socket.on('leave_matchmaking', async () => {
      await MatchmakingService.dequeue(socket.id);
      socket.emit('queue_left');
    });

    // 3. Live test progress update
    socket.on('test_progress', ({ roomId, passedCount, totalCount, statusText }) => {
      socket.to(roomId).emit('opponent_progress', {
        passedCount,
        totalCount,
        statusText
      });
    });

    // 4. Submit solution in live battle
    socket.on('submit_solution', async ({ roomId, code, language }) => {
      const battle = await MatchmakingService.getBattle(roomId);
      if (!battle || battle.status !== 'IN_PROGRESS') return;

      try {
        const evalResult = await evaluateSubmission({
          problemId: battle.problem._id || battle.problem.slug,
          code,
          language
        });

        if (evalResult.status === 'ACCEPTED' || evalResult.verdict === 'ACCEPTED') {
          battle.status = 'COMPLETED';
          const isPlayer1 = socket.id === battle.player1.socketId;
          const winner = isPlayer1 ? battle.player1 : battle.player2;
          const loser = isPlayer1 ? battle.player2 : battle.player1;

          // ELO updates in MongoDB if real user IDs exist
          if (winner.userId && winner.userId.length === 24) {
            await User.findByIdAndUpdate(winner.userId, { $inc: { 'stats.rating': 32, 'stats.xp': 50 } });
            await RatingHistory.create({
              userId: winner.userId,
              newRating: winner.rating + 32,
              ratingChange: 32,
              reason: 'BATTLE_WIN'
            });
          }

          if (loser.userId && loser.userId.length === 24) {
            await User.findByIdAndUpdate(loser.userId, { $inc: { 'stats.rating': -18 } });
            await RatingHistory.create({
              userId: loser.userId,
              newRating: Math.max(800, loser.rating - 18),
              ratingChange: -18,
              reason: 'BATTLE_LOSS'
            });
          }

          io.to(roomId).emit('battle_finished', {
            winnerUsername: winner.username,
            winnerSocketId: winner.socketId,
            ratingDeltaWinner: 32,
            ratingDeltaLoser: -18,
            verdict: 'ACCEPTED'
          });

          await MatchmakingService.removeBattle(roomId);
        } else {
          socket.emit('submission_feedback', {
            verdict: evalResult.status || evalResult.verdict,
            message: evalResult.errorMessage || 'Some test cases failed. Keep coding!'
          });
        }
      } catch (err) {
        socket.emit('submission_feedback', {
          verdict: 'ERROR',
          message: err.message
        });
      }
    });

    // 5. Disconnect handling
    socket.on('disconnect', async () => {
      await MatchmakingService.dequeue(socket.id);
    });
  });

  return io;
};
