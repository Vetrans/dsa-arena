import { describe, it, expect } from 'vitest';
import { MatchmakingService } from '../src/services/matchmakingService.js';
import { getSubmissionQueue } from '../src/queues/submissionQueue.js';

describe('Scalable Real-Time Matchmaking Service', () => {
  it('should enqueue and match two players in proximity', async () => {
    const player1 = {
      socketId: 'sock_player1',
      userId: 'user_1',
      username: 'CodeNinja',
      rating: 1200
    };

    const player2 = {
      socketId: 'sock_player2',
      userId: 'user_2',
      username: 'AlgoMaster',
      rating: 1250
    };

    await MatchmakingService.enqueue(player1);
    await MatchmakingService.enqueue(player2);

    const match = await MatchmakingService.findOpponent(player1);
    expect(match).toBeDefined();
    expect(match?.username).toBe('AlgoMaster');
  });

  it('should gracefully dequeue player when leaving matchmaking', async () => {
    const player = {
      socketId: 'sock_leaving',
      userId: 'user_3',
      username: 'LoneCoder',
      rating: 1100
    };

    await MatchmakingService.enqueue(player);
    await MatchmakingService.dequeue(player.socketId);
    const opponent = await MatchmakingService.findOpponent(player);
    expect(opponent).toBeNull();
  });
});

describe('BullMQ Queue Initialization', () => {
  it('should safely handle queue request without crashing when offline', () => {
    const queue = getSubmissionQueue();
    // In local unit test without active Redis server, it should return null or initialized instance without throw
    expect(queue === null || typeof queue === 'object').toBe(true);
  });
});

describe('Problem Document Splitting & TestCases', () => {
  it('should verify ProblemTestCase schema exports and properties', async () => {
    const { ProblemTestCase } = await import('../src/models/ProblemTestCase.js');
    expect(ProblemTestCase).toBeDefined();
    expect(ProblemTestCase.modelName).toBe('ProblemTestCase');
  });
});

describe('Distributed Cron Scheduler Configuration', () => {
  it('should export setupDistributedScheduler without throw', async () => {
    const { setupDistributedScheduler } = await import('../src/schedulers/cronScheduler.js');
    expect(typeof setupDistributedScheduler).toBe('function');
  });
});

