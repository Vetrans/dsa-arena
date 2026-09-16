import { describe, it, expect } from 'vitest';
import { evaluateSubmission } from '../src/services/judgeService.js';
import { calculateLevel, calculateRank, calculateXP, calculateRating } from '../src/config/gameConfig.js';

describe('Judge Service', () => {
  it('should return COMPILATION_ERROR for empty code', async () => {
    const result = await evaluateSubmission({ code: '', language: 'javascript', testCases: [] });
    expect(result.status).toBe('COMPILATION_ERROR');
  });

  it('should evaluate valid JavaScript function successfully', async () => {
    const code = `
      function twoSum(nums, target) {
        return [0, 1];
      }
    `;
    const testCases = [
      { input: '[2,7,11,15], 9', expected: '[0,1]' }
    ];

    const result = await evaluateSubmission({
      code,
      language: 'javascript',
      testCases
    });

    expect(result.status).toBe('ACCEPTED');
    expect(result.passedTestCases).toBe(1);
  });

  it('should flag wrong answer when output does not match', async () => {
    const code = `
      function twoSum(nums, target) {
        return [1, 2];
      }
    `;
    const testCases = [
      { input: '[2,7,11,15], 9', expected: '[0,1]' }
    ];

    const result = await evaluateSubmission({
      code,
      language: 'javascript',
      testCases
    });

    expect(result.status).toBe('WRONG_ANSWER');
    expect(result.passedTestCases).toBe(0);
  });

  it('should dynamically execute arrow functions with custom names', async () => {
    const code = `
      const myCustomSumAlgo = (nums, target) => {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
          const comp = target - nums[i];
          if (map.has(comp)) return [map.get(comp), i];
          map.set(nums[i], i);
        }
        return [];
      };
    `;
    const testCases = [
      { input: '[2, 7, 11, 15], 9', expected: '[0, 1]' },
      { input: '[3, 2, 4], 6', expected: '[1, 2]' }
    ];

    const result = await evaluateSubmission({
      code,
      language: 'javascript',
      testCases
    });

    expect(result.status).toBe('ACCEPTED');
    expect(result.passedTestCases).toBe(2);
  });

  it('should dynamically execute class Solution methods', async () => {
    const code = `
      class Solution {
        solve(s) {
          return s === s.split('').reverse().join('');
        }
      }
    `;
    const testCases = [
      { input: '"racecar"', expected: 'true' },
      { input: '"hello"', expected: 'false' }
    ];

    const result = await evaluateSubmission({
      code,
      language: 'javascript',
      testCases
    });

    expect(result.status).toBe('ACCEPTED');
    expect(result.passedTestCases).toBe(2);
  });

  it('should execute Python solutions dynamically', async () => {
    const code = `
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
`;
    const testCases = [
      { input: '[2, 7, 11, 15], 9', expected: '[0, 1]' }
    ];

    const result = await evaluateSubmission({
      code,
      language: 'python',
      testCases
    });

    expect(result.status).toBe('ACCEPTED');
    expect(result.passedTestCases).toBe(1);
  });
});

describe('Game Config', () => {
  it('should correctly calculate levels based on XP', () => {
    // LEVEL_FORMULA(1) = 50(1) + 50(1) = 100
    // LEVEL_FORMULA(2) = 50(4) + 50(2) = 300
    // LEVEL_FORMULA(3) = 50(9) + 50(3) = 600
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(150)).toBe(2);
    expect(calculateLevel(500)).toBe(3);
  });

  it('should correctly map rank tiers according to rating', () => {
    expect(calculateRank(200).fullName).toBe('Bronze II');
    expect(calculateRank(800).name).toBe('Silver');
    expect(calculateRank(2500).name).toBe('Master');
  });

  it('should calculate appropriate XP for different difficulties and first solve', () => {
    const firstTryEasy = calculateXP({ difficulty: 'Easy', isFirstSolve: true });
    const retryEasy = calculateXP({ difficulty: 'Easy', isFirstSolve: false });
    const firstTryHard = calculateXP({ difficulty: 'Hard', isFirstSolve: true });

    expect(firstTryEasy).toBeGreaterThan(retryEasy);
    expect(firstTryHard).toBeGreaterThan(firstTryEasy);
  });
});
