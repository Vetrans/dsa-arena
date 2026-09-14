import { redis, redisAvailable } from '../config/redis.js';
import { logger } from '../config/logger.js';

const LOCAL_QUEUE = [];
const LOCAL_BATTLES = new Map();

const REDIS_QUEUE_KEY = 'matchmaking:pool';
const REDIS_BATTLE_PREFIX = 'battle:room:';

export const MatchmakingService = {
  /**
   * Enqueue player for matchmaking
   */
  async enqueue(player) {
    if (redisAvailable) {
      try {
        // Store player details in a hash and add to sorted set scored by rating
        const playerKey = `matchmaking:player:${player.socketId}`;
        await redis.set(playerKey, JSON.stringify(player), { EX: 600 });
        await redis.zAdd(REDIS_QUEUE_KEY, { score: player.rating, value: player.socketId });
        return;
      } catch (err) {
        logger.warn({ err }, 'Redis matchmaking enqueue failed, falling back to local');
      }
    }
    LOCAL_QUEUE.push(player);
  },

  /**
   * Remove player from matchmaking
   */
  async dequeue(socketId) {
    if (redisAvailable) {
      try {
        await redis.zRem(REDIS_QUEUE_KEY, socketId);
        await redis.del(`matchmaking:player:${socketId}`);
        return;
      } catch (err) {
        logger.warn({ err }, 'Redis matchmaking dequeue failed');
      }
    }
    const idx = LOCAL_QUEUE.findIndex((p) => p.socketId === socketId);
    if (idx !== -1) LOCAL_QUEUE.splice(idx, 1);
  },

  /**
   * Look for an opponent matching rating proximity (within +/- 250 rating)
   * Uses Redis Lua script to atomically pop opponent & player from ZSET
   */
  async findOpponent(player) {
    if (redisAvailable) {
      try {
        const minScore = Math.max(0, player.rating - 250);
        const maxScore = player.rating + 250;

        // Atomic Matchmaking Pop Lua Script
        const luaScript = `
          local poolKey = KEYS[1]
          local minScore = tonumber(ARGV[1])
          local maxScore = tonumber(ARGV[2])
          local playerSocket = ARGV[3]
          local candidates = redis.call('ZRANGEBYSCORE', poolKey, minScore, maxScore, 'LIMIT', 0, 5)
          for _, opponent in ipairs(candidates) do
              if opponent ~= playerSocket then
                  redis.call('ZREM', poolKey, opponent)
                  redis.call('ZREM', poolKey, playerSocket)
                  return opponent
              end
          end
          return nil
        `;

        const opponentSocketId = await redis.eval(luaScript, {
          keys: [REDIS_QUEUE_KEY],
          arguments: [String(minScore), String(maxScore), String(player.socketId)]
        });

        if (opponentSocketId) {
          const data = await redis.get(`matchmaking:player:${opponentSocketId}`);
          await redis.del(`matchmaking:player:${opponentSocketId}`);
          await redis.del(`matchmaking:player:${player.socketId}`);
          return data ? JSON.parse(data) : { socketId: opponentSocketId, rating: player.rating, username: 'Contender' };
        }
        return null;
      } catch (err) {
        logger.warn({ err }, 'Redis Lua findOpponent failed, fallback to local');
      }
    }


    // Local fallback
    if (LOCAL_QUEUE.length > 0) {
      const idx = LOCAL_QUEUE.findIndex((p) => p.socketId !== player.socketId);
      if (idx !== -1) {
        const opponent = LOCAL_QUEUE.splice(idx, 1)[0];
        const playerIdx = LOCAL_QUEUE.findIndex((p) => p.socketId === player.socketId);
        if (playerIdx !== -1) LOCAL_QUEUE.splice(playerIdx, 1);
        return opponent;
      }
    }
    return null;
  },

  /**
   * Store active battle room state
   */
  async setBattle(roomId, battleData) {
    if (redisAvailable) {
      try {
        await redis.set(`${REDIS_BATTLE_PREFIX}${roomId}`, JSON.stringify(battleData), { EX: 3600 });
        return;
      } catch (err) {
        logger.warn({ err, roomId }, 'Redis setBattle failed');
      }
    }
    LOCAL_BATTLES.set(roomId, battleData);
  },

  /**
   * Get active battle room state
   */
  async getBattle(roomId) {
    if (redisAvailable) {
      try {
        const data = await redis.get(`${REDIS_BATTLE_PREFIX}${roomId}`);
        return data ? JSON.parse(data) : null;
      } catch (err) {
        logger.warn({ err, roomId }, 'Redis getBattle failed');
      }
    }
    return LOCAL_BATTLES.get(roomId) || null;
  },

  /**
   * Delete battle room
   */
  async removeBattle(roomId) {
    if (redisAvailable) {
      try {
        await redis.del(`${REDIS_BATTLE_PREFIX}${roomId}`);
        return;
      } catch (err) {
        logger.warn({ err, roomId }, 'Redis removeBattle failed');
      }
    }
    LOCAL_BATTLES.delete(roomId);
  }
};
