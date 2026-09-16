import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
  User,
  Topic,
  Problem,
  Achievement,
  Submission,
  UserProblem,
  RatingHistory,
  XPTransaction,
  Streak,
  Comment,
  DailyChallenge,
  ProblemTestCase
} from '../models/index.js';
import { EXTENDED_PROBLEMS } from './problemsBank.js';
import { PROBLEMS_19_200 } from './problems19_200.js';

dotenv.config();

export const TOPICS_DATA = [
  { name: 'Arrays', slug: 'arrays', icon: '📊', description: 'Contiguous memory collections and index operations.', order: 1 },
  { name: 'Strings', slug: 'strings', icon: '🔤', description: 'Text manipulation, parsing, and anagram techniques.', order: 2 },
  { name: 'Two Pointers', slug: 'two-pointers', icon: '👉', description: 'Dual index traversal for sorted sequences.', order: 3 },
  { name: 'Sliding Window', slug: 'sliding-window', icon: '🪟', description: 'Dynamic subsegment tracking in linear time.', order: 4 },
  { name: 'Hashing', slug: 'hashing', icon: '🔑', description: 'O(1) average lookup maps and frequency sets.', order: 5 },
  { name: 'Stack', slug: 'stack', icon: '🥞', description: 'LIFO structures for parenthesis, monotonic scans.', order: 6 },
  { name: 'Queue', slug: 'queue', icon: '🚶', description: 'FIFO data structures and BFS exploration buffers.', order: 7 },
  { name: 'Linked Lists', slug: 'linked-lists', icon: '🔗', description: 'Node reference chains, reversals, and cycles.', order: 8 },
  { name: 'Trees', slug: 'trees', icon: '🌳', description: 'Binary trees, BST traversal, depth calculations.', order: 9 },
  { name: 'Heaps & Priority Queues', slug: 'heaps', icon: '⛰️', description: 'Min/max heap order for top-K extraction.', order: 10 },
  { name: 'Recursion', slug: 'recursion', icon: '🔄', description: 'Self-referential divide and conquer patterns.', order: 11 },
  { name: 'Backtracking', slug: 'backtracking', icon: '🔙', description: 'State space search with pruning heuristics.', order: 12 },
  { name: 'Graphs', slug: 'graphs', icon: '🕸️', description: 'Vertices, edges, BFS, DFS, Dijkstra, cycles.', order: 13 },
  { name: 'Dynamic Programming', slug: 'dynamic-programming', icon: '⚡', description: 'Optimal substructure and memoized subproblems.', order: 14 },
  { name: 'Greedy', slug: 'greedy', icon: '🤑', description: 'Locally optimal choices yielding global optimums.', order: 15 },
  { name: 'Binary Search', slug: 'binary-search', icon: '🔍', description: 'Logarithmic search space halving.', order: 16 },
  { name: 'Bit Manipulation', slug: 'bit-manipulation', icon: '🔢', description: 'Binary XOR, bitmasking, and bitwise tricks.', order: 17 },
  { name: 'Prefix Sum', slug: 'prefix-sum', icon: '➕', description: 'Cumulative sum arrays for O(1) range queries.', order: 18 },
  { name: 'Math', slug: 'math', icon: '➗', description: 'Number theory, modular arithmetic, and combinatorial math.', order: 19 },
  { name: 'Matrix', slug: 'matrix', icon: '🔲', description: '2D grid traversals, coordinate geometry, and transformations.', order: 20 },
  { name: 'Trie', slug: 'trie', icon: '🌲', description: 'Prefix trees for efficient string retrieval and autocomplete.', order: 21 },
  { name: 'Sorting', slug: 'sorting', icon: '📶', description: 'QuickSort, MergeSort, custom comparators, and ordering.', order: 22 }
];

const ACHIEVEMENTS_DATA = [
  // First steps
  { key: 'FIRST_SOLVE', name: 'First Arena Blood', description: 'Solve your very first DSA problem in the Arena.', category: 'FIRST_STEPS', icon: '⚔️', condition: { type: 'problems_solved', threshold: 1 }, xpReward: 25, rarity: 'COMMON', order: 1 },
  { key: 'FIRST_MEDIUM', name: 'Stepping Up', description: 'Solve your first Medium difficulty problem.', category: 'FIRST_STEPS', icon: '⚡', condition: { type: 'medium_solved', threshold: 1 }, xpReward: 50, rarity: 'UNCOMMON', order: 2 },
  { key: 'FIRST_HARD', name: 'NYC Titan', description: 'Conquer your first Hard difficulty problem.', category: 'FIRST_STEPS', icon: '🛡️', condition: { type: 'hard_solved', threshold: 1 }, xpReward: 100, rarity: 'RARE', order: 3 },
  
  // Consistency
  { key: 'STREAK_3', name: 'Subway Regular', description: 'Maintain a 3-day problem solving streak.', category: 'CONSISTENCY', icon: '🚇', condition: { type: 'streak_days', threshold: 3 }, xpReward: 30, rarity: 'COMMON', order: 4 },
  { key: 'STREAK_7', name: 'Empire State Habit', description: 'Maintain a 7-day problem solving streak.', category: 'CONSISTENCY', icon: '🔥', condition: { type: 'streak_days', threshold: 7 }, xpReward: 100, rarity: 'UNCOMMON', order: 5 },
  { key: 'STREAK_30', name: 'Wall Street Grind', description: 'Maintain a 30-day problem solving streak.', category: 'CONSISTENCY', icon: '💎', condition: { type: 'streak_days', threshold: 30 }, xpReward: 500, rarity: 'EPIC', order: 6 },
  
  // Milestones
  { key: 'SOLVE_10', name: 'Problem Initiate', description: 'Solve 10 DSA problems in the Arena.', category: 'MILESTONES', icon: '🎯', condition: { type: 'problems_solved', threshold: 10 }, xpReward: 75, rarity: 'COMMON', order: 7 },
  { key: 'SOLVE_25', name: 'Algorithm Adept', description: 'Solve 25 DSA problems in the Arena.', category: 'MILESTONES', icon: '🥋', condition: { type: 'problems_solved', threshold: 25 }, xpReward: 150, rarity: 'UNCOMMON', order: 8 },
  { key: 'SOLVE_50', name: 'Arena Veteran', description: 'Solve 50 DSA problems in the Arena.', category: 'MILESTONES', icon: '👑', condition: { type: 'problems_solved', threshold: 50 }, xpReward: 300, rarity: 'RARE', order: 9 },

  // Competitive
  { key: 'RATING_1500', name: 'Gold Contender', description: 'Reach a competitive rating of 1,000+ (Gold Rank).', category: 'COMPETITIVE', icon: '🥇', condition: { type: 'rating_reached', threshold: 1000 }, xpReward: 150, rarity: 'UNCOMMON', order: 10 },
  { key: 'RATING_2000', name: 'Diamond Mastermind', description: 'Reach a competitive rating of 2,000+ (Diamond Rank).', category: 'COMPETITIVE', icon: '💎', condition: { type: 'rating_reached', threshold: 2000 }, xpReward: 500, rarity: 'EPIC', order: 11 }
];

export const PROBLEMS_DATA = [
  {
    problemNumber: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topicSlugs: ['arrays', 'hashing'],
    tags: ['Hash Table', 'Two Pointers'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    examples: [
      { input: '[2, 7, 11, 15], 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: '[3, 2, 4], 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] == 6.' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    hints: [
      { order: 1, content: 'A brute force approach checks all pairs in O(N^2) time. Can you do it faster in O(N)?' },
      { order: 2, content: 'Use a Hash Map to store numbers you have already visited and their indices.' },
      { order: 3, content: 'For each number x, check if (target - x) is already present in your hash map.' }
    ],
    editorial: {
      approach: 'Hash Map Lookup',
      intuition: 'Instead of searching repeatedly for target - x in the array, store seen values in a hash map for O(1) retrieval.',
      algorithm: '1. Initialize an empty hash map.\n2. Iterate through nums with index i.\n3. Calculate complement = target - nums[i].\n4. If complement in map, return [map[complement], i].\n5. Otherwise, insert nums[i] -> i into the map.',
      complexity: { time: 'O(N)', space: 'O(N)' },
      approaches: [
        {
          name: 'One-Pass Hash Table',
          intuition: 'Store complements in an associative map while scanning.',
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(N)',
          code: [
            {
              language: 'javascript',
              solution: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`
            },
            {
              language: 'python',
              solution: `def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`
            },
            {
              language: 'cpp',
              solution: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`
            }
          ]
        }
      ],
      commonMistakes: ['Using the same index twice (e.g. nums[i] + nums[i] == target)', 'Returning values instead of indices']
    },
    testCases: [
      { input: '[2, 7, 11, 15], 9', expected: '[0,1]', isHidden: false },
      { input: '[3, 2, 4], 6', expected: '[1,2]', isHidden: false },
      { input: '[3, 3], 6', expected: '[0,1]', isHidden: true },
      { input: '[1, 5, 8, 12, 19], 20', expected: '[0,4]', isHidden: true }
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n}',
      python: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}'
    },
    rewards: { xp: 15, rating: 10 }
  },
  {
    problemNumber: 2,
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    topicSlugs: ['strings', 'two-pointers'],
    tags: ['Two Pointers', 'String'],
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string \`s\`, return \`true\` *if it is a palindrome, or* \`false\` *otherwise*.`,
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: '"race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    hints: [
      { order: 1, content: 'Consider two pointers: one at the beginning and one at the end.' },
      { order: 2, content: 'Advance the left pointer past non-alphanumeric chars, and retreat the right pointer.' }
    ],
    editorial: {
      approach: 'Two Pointers Traversal',
      intuition: 'Compare characters from outside moving inward while skipping symbols.',
      algorithm: '1. Initialize left = 0, right = s.length - 1.\n2. Skip invalid chars on both sides.\n3. Compare lowercase chars.\n4. Return true if pointers cross without mismatch.',
      complexity: { time: 'O(N)', space: 'O(1)' }
    },
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expected: 'true', isHidden: false },
      { input: '"race a car"', expected: 'false', isHidden: false },
      { input: '" "', expected: 'true', isHidden: true },
      { input: '"0P"', expected: 'false', isHidden: true }
    ],
    starterCode: {
      javascript: 'function isPalindrome(s) {\n  // Write your code here\n}',
      python: 'def isPalindrome(s: str) -> bool:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your code here\n        return false;\n    }\n}'
    },
    rewards: { xp: 15, rating: 10 }
  },
  {
    problemNumber: 3,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topicSlugs: ['strings', 'sliding-window', 'hashing'],
    tags: ['Sliding Window', 'Hash Table'],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      { input: '"abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: '"bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: '"pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    hints: [
      { order: 1, content: 'Use a sliding window [left, right] with a set or map of character positions.' },
      { order: 2, content: 'When a duplicate is encountered, slide the left pointer past the previous index of that character.' }
    ],
    editorial: {
      approach: 'Sliding Window with Hash Map',
      intuition: 'Maintain a window of unique characters and expand right while shrinking left on duplicates.',
      complexity: { time: 'O(N)', space: 'O(min(M, N))' }
    },
    testCases: [
      { input: '"abcabcbb"', expected: '3', isHidden: false },
      { input: '"bbbbb"', expected: '1', isHidden: false },
      { input: '"pwwkew"', expected: '3', isHidden: false },
      { input: '""', expected: '0', isHidden: true }
    ],
    starterCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Write your code here\n}',
      python: 'def lengthOfLongestSubstring(s: str) -> int:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n        return 0;\n    }\n}'
    },
    rewards: { xp: 30, rating: 25 }
  },
  {
    problemNumber: 4,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    topicSlugs: ['stack', 'strings'],
    tags: ['Stack', 'String'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: '"()"', output: 'true', explanation: 'Matching simple parentheses.' },
      { input: '"()[]{}"', output: 'true', explanation: 'All matching types.' },
      { input: '"(]"', output: 'false', explanation: 'Mismatched closing bracket.' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \`()[]{}\`.'],
    hints: [
      { order: 1, content: 'Push open brackets onto a stack.' },
      { order: 2, content: 'When encountering a closing bracket, check if the stack top matches.' }
    ],
    editorial: {
      approach: 'Stack Verification',
      intuition: 'Last opened bracket must be the first closed bracket (LIFO structure).',
      complexity: { time: 'O(N)', space: 'O(N)' }
    },
    testCases: [
      { input: '"()"', expected: 'true', isHidden: false },
      { input: '"()[]{}"', expected: 'true', isHidden: false },
      { input: '"(]"', expected: 'false', isHidden: false },
      { input: '"([)]"', expected: 'false', isHidden: true }
    ],
    starterCode: {
      javascript: 'function isValid(s) {\n  // Write your code here\n}',
      python: 'def isValid(s: str) -> bool:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}'
    },
    rewards: { xp: 15, rating: 10 }
  },
  {
    problemNumber: 5,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    topicSlugs: ['dynamic-programming', 'recursion'],
    tags: ['Dynamic Programming', 'Math'],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.\n\nEach time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: '2', output: '2', explanation: '1. 1 step + 1 step\n2. 2 steps' },
      { input: '3', output: '3', explanation: '1. 1+1+1\n2. 1+2\n3. 2+1' }
    ],
    constraints: ['1 <= n <= 45'],
    hints: [
      { order: 1, content: 'To reach step n, you could have come from step n-1 or step n-2.' },
      { order: 2, content: 'ways(n) = ways(n-1) + ways(n-2). This is Fibonacci!' }
    ],
    editorial: {
      approach: 'Bottom-up Dynamic Programming',
      intuition: 'Each step depends on the sum of ways to reach the previous two steps.',
      complexity: { time: 'O(N)', space: 'O(1)' }
    },
    testCases: [
      { input: '2', expected: '2', isHidden: false },
      { input: '3', expected: '3', isHidden: false },
      { input: '4', expected: '5', isHidden: true },
      { input: '5', expected: '8', isHidden: true }
    ],
    starterCode: {
      javascript: 'function climbStairs(n) {\n  // Write your code here\n}',
      python: 'def climbStairs(n: int) -> int:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}'
    },
    rewards: { xp: 15, rating: 10 }
  },
  {
    problemNumber: 6,
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    topicSlugs: ['dynamic-programming'],
    tags: ['Dynamic Programming', 'Breadth-First Search'],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.\n\nReturn *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.\n\nYou may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: '[1, 2, 5], 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: '[2], 3', output: '-1', explanation: 'Cannot form 3 using only 2s.' }
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    hints: [
      { order: 1, content: 'Define dp[i] as the minimum coins needed to make amount i.' },
      { order: 2, content: 'dp[i] = min(dp[i - c] + 1) for each coin c <= i.' }
    ],
    editorial: {
      approach: 'Bottom-up DP Array',
      intuition: 'Compute minimal cost for all values 1..amount using previous subproblem results.',
      complexity: { time: 'O(amount * len(coins))', space: 'O(amount)' }
    },
    testCases: [
      { input: '[1, 2, 5], 11', expected: '3', isHidden: false },
      { input: '[2], 3', expected: '-1', isHidden: false },
      { input: '[1], 0', expected: '0', isHidden: true }
    ],
    starterCode: {
      javascript: 'function coinChange(coins, amount) {\n  // Write your code here\n}',
      python: 'def coinChange(coins: list[int], amount: int) -> int:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your code here\n        return -1;\n    }\n}'
    },
    rewards: { xp: 35, rating: 25 }
  },
  {
    problemNumber: 7,
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    topicSlugs: ['graphs'],
    tags: ['Depth-First Search', 'Breadth-First Search', 'Matrix'],
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1',
        explanation: 'All 1s form one connected island.'
      }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is "0" or "1".'],
    hints: [
      { order: 1, content: 'Iterate through the grid. When you see a "1", increment your island counter and start a DFS/BFS.' },
      { order: 2, content: 'During traversal, sink visited land by changing "1" to "0".' }
    ],
    editorial: {
      approach: 'DFS Flood Fill',
      intuition: 'Traverse grid, on encountering unvisited land, run connected-component DFS and mark visited.',
      complexity: { time: 'O(M * N)', space: 'O(M * N)' }
    },
    testCases: [
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expected: '3', isHidden: false },
      { input: '[["1"]]', expected: '1', isHidden: true },
      { input: '[["0"]]', expected: '0', isHidden: true }
    ],
    starterCode: {
      javascript: 'function numIslands(grid) {\n  // Write your code here\n}',
      python: 'def numIslands(grid: list[list[str]]) -> int:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n        return 0;\n    }\n}'
    },
    rewards: { xp: 35, rating: 25 }
  },
  {
    problemNumber: 8,
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    topicSlugs: ['binary-search', 'arrays'],
    tags: ['Binary Search', 'Array'],
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.\n\nYou must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      { input: '[-1, 0, 3, 5, 9, 12], 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      { input: '[-1, 0, 3, 5, 9, 12], 2', output: '-1', explanation: '2 does not exist in nums so return -1' }
    ],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All the integers in nums are unique.', 'nums is sorted in ascending order.'],
    hints: [
      { order: 1, content: 'Maintain left and right boundaries. Mid = left + (right - left) // 2.' },
      { order: 2, content: 'If nums[mid] == target return mid. If nums[mid] < target search right half, else left half.' }
    ],
    editorial: {
      approach: 'Classic Binary Search',
      intuition: 'Halve the search space at each comparison due to sorted order.',
      complexity: { time: 'O(log N)', space: 'O(1)' }
    },
    testCases: [
      { input: '[-1, 0, 3, 5, 9, 12], 9', expected: '4', isHidden: false },
      { input: '[-1, 0, 3, 5, 9, 12], 2', expected: '-1', isHidden: false },
      { input: '[5], 5', expected: '0', isHidden: true }
    ],
    starterCode: {
      javascript: 'function search(nums, target) {\n  // Write your code here\n}',
      python: 'def search(nums: list[int], target: int) -> int:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}'
    },
    rewards: { xp: 15, rating: 10 }
  }
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nyc-dsa-arena';
    console.log('Connecting to MongoDB for seeding:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // 1. Clear existing data
    console.log('Clearing old data...');
    await Promise.all([
      Topic.deleteMany({}),
      Achievement.deleteMany({}),
      Problem.deleteMany({}),
      User.deleteMany({}),
      Submission.deleteMany({}),
      UserProblem.deleteMany({}),
      RatingHistory.deleteMany({}),
      XPTransaction.deleteMany({}),
      Streak.deleteMany({}),
      Comment.deleteMany({}),
      DailyChallenge.deleteMany({}),
      ProblemTestCase.deleteMany({})
    ]);

    // 2. Seed Topics
    console.log('Seeding Topics...');
    const createdTopics = await Topic.insertMany(TOPICS_DATA);
    const topicMap = {};
    createdTopics.forEach(t => {
      topicMap[t.slug] = t._id;
    });

    // 3. Seed Achievements
    console.log('Seeding Achievements...');
    await Achievement.insertMany(ACHIEVEMENTS_DATA);

    // 4. Seed Clean System Administrator only if none exists
    console.log('Checking Admin Account...');
    let adminUser = await User.findOne({ role: 'ADMIN' });
    if (!adminUser) {
      const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@nycdsaarena.com';
      const adminPass = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@123456';
      adminUser = await User.create({
        username: 'nycadmins',
        email: adminEmail,
        passwordHash: adminPass,
        displayName: 'Arena Director',
        bio: 'NYC DSA Arena Official System Administrator.',
        role: 'ADMIN',
        stats: {
          rating: 1500,
          xp: 0,
          level: 1,
          rank: 'Gold I',
          problemsSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          totalSubmissions: 0,
          acceptedSubmissions: 0,
          accuracy: 0,
          currentStreak: 0,
          longestStreak: 0
        }
      });
      console.log(`Created Initial Clean Admin Account (${adminEmail})`);
    }

    // 5. Seed Problems
    console.log('Seeding Problems Bank...');
    const allProblems = [...PROBLEMS_DATA, ...EXTENDED_PROBLEMS, ...PROBLEMS_19_200];
    const problemsToInsert = allProblems.map(p => {
      const topicIds = p.topicSlugs.map(slug => topicMap[slug]).filter(Boolean);
      return {
        ...p,
        topics: topicIds,
        author: adminUser._id,
        status: 'PUBLISHED'
      };
    });

    const createdProblems = await Problem.insertMany(problemsToInsert);

    // Securely partition hidden test cases into ProblemTestCase collection
    const testCasesToInsert = [];
    for (const p of createdProblems) {
      if (p.testCases && p.testCases.length > 0) {
        const hiddenCases = p.testCases.filter(tc => tc.isHidden);
        if (hiddenCases.length > 0) {
          testCasesToInsert.push({
            problemId: p._id,
            testCases: hiddenCases
          });
        }
      }
    }
    if (testCasesToInsert.length > 0) {
      await ProblemTestCase.insertMany(testCasesToInsert);
    }

    // Update topic problem counts
    for (const p of createdProblems) {
      if (p.topics) {
        await Topic.updateMany({ _id: { $in: p.topics } }, { $inc: { problemCount: 1 } });
      }
    }

    // 6. Dynamic Daily Challenge Initialization
    console.log('Initializing Daily Challenge...');
    const today = new Date().toISOString().split('T')[0];
    const randomProblem = createdProblems[Math.floor(Math.random() * createdProblems.length)];
    await DailyChallenge.create({
      date: today,
      problemId: randomProblem._id,
      bonusXp: 25,
      bonusRating: 15,
      completedBy: []
    });

    console.log('System bootstrap completed successfully! 🎉');
    console.log(`- Topics: ${createdTopics.length}`);
    console.log(`- Problems: ${createdProblems.length}`);
    console.log(`- Achievements: ${ACHIEVEMENTS_DATA.length}`);
    console.log(`- Dynamic Users: 0 staged fake users. Ready for live contenders!`);
  } catch (error) {
    console.error('Error bootstrapping system:', error);

  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

// If run directly via `node src/seed/index.js`
if (process.argv[1] && process.argv[1].includes('seed')) {
  seedDatabase();
}
