import { Server } from 'socket.io';
import { Problem } from '../models/Problem.js';
import { User } from '../models/User.js';
import { RatingHistory } from '../models/RatingHistory.js';
import { evaluateSubmission } from '../services/judgeService.js';
import { logger } from '../config/logger.js';

export const setupBattleSockets = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const matchmakingQueue = [];
  const activeBattles = new Map(); // roomId -> { player1, player2, problem, startTime, status }

  io.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, 'Socket connected to Battle Arena');

    // 1. Join matchmaking queue
    socket.on('join_matchmaking', async (userData) => {
      const player = {
        socketId: socket.id,
        userId: userData?.userId || socket.id,
        username: userData?.username || `Warrior_${socket.id.slice(0, 4)}`,
        rating: Number(userData?.rating || 1200)
      };

      // Check if opponent is waiting
      if (matchmakingQueue.length > 0) {
        const opponent = matchmakingQueue.shift();
        if (opponent.socketId === socket.id) {
          matchmakingQueue.push(player);
          return;
        }

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

        activeBattles.set(roomId, battleData);

        // Notify both players
        io.to(roomId).emit('match_found', {
          roomId,
          problem,
          players: [player, opponent],
          durationSeconds: 900
        });

        logger.info({ roomId, p1: player.username, p2: opponent.username }, '1v1 Battle initiated');
      } else {
        matchmakingQueue.push(player);
        socket.emit('queue_joined', { position: matchmakingQueue.length });
      }
    });

    // 2. Cancel matchmaking
    socket.on('leave_matchmaking', () => {
      const idx = matchmakingQueue.findIndex((p) => p.socketId === socket.id);
      if (idx !== -1) matchmakingQueue.splice(idx, 1);
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
      const battle = activeBattles.get(roomId);
      if (!battle || battle.status !== 'IN_PROGRESS') return;

      try {
        const evalResult = await evaluateSubmission({
          problemId: battle.problem._id || battle.problem.slug,
          code,
          language
        });

        if (evalResult.verdict === 'ACCEPTED') {
          battle.status = 'COMPLETED';
          const isPlayer1 = socket.id === battle.player1.socketId;
          const winner = isPlayer1 ? battle.player1 : battle.player2;
          const loser = isPlayer1 ? battle.player2 : battle.player1;

          // ELO updates in MongoDB if real user IDs exist
          if (winner.userId && winner.userId.length === 24) {
            await User.findByIdAndUpdate(winner.userId, { $inc: { rating: 32, xp: 50 } });
            await RatingHistory.create({
              userId: winner.userId,
              newRating: winner.rating + 32,
              ratingChange: 32,
              reason: 'BATTLE_WIN'
            });
          }

          if (loser.userId && loser.userId.length === 24) {
            await User.findByIdAndUpdate(loser.userId, { $inc: { rating: -18 } });
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

          activeBattles.delete(roomId);
        } else {
          socket.emit('submission_feedback', {
            verdict: evalResult.verdict,
            message: evalResult.message || 'Some testcases failed. Keep coding!'
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
    socket.on('disconnect', () => {
      const qIdx = matchmakingQueue.findIndex((p) => p.socketId === socket.id);
      if (qIdx !== -1) matchmakingQueue.splice(qIdx, 1);

      // Check active battles
      for (const [roomId, battle] of activeBattles.entries()) {
        if (battle.player1.socketId === socket.id || battle.player2.socketId === socket.id) {
          const winner = battle.player1.socketId === socket.id ? battle.player2 : battle.player1;
          io.to(roomId).emit('battle_finished', {
            winnerUsername: winner.username,
            winnerSocketId: winner.socketId,
            ratingDeltaWinner: 32,
            ratingDeltaLoser: -18,
            reason: 'OPPONENT_DISCONNECTED'
          });
          activeBattles.delete(roomId);
        }
      }
    });
  });

  return io;
};
