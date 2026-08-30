export const PROBLEMS = [
  {
    id: "two-sum",
    problemNumber: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    topics: ["Arrays", "Hashing"],
    topicSlugs: ["arrays", "hashing"],
    tags: ["Array", "Hash Table"],
    acceptance: "54.2%",
    rewards: { xp: 20, rating: 15 },
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 6, returning [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    hints: [
      { order: 1, content: "A brute force approach checks every pair, taking O(N^2) time. Can we do better with a hash map?" },
      { order: 2, content: "As you iterate through the array, check if (target - current_num) already exists in your map. If so, you found the pair!" }
    ],
    editorial: {
      approach: "One-Pass Hash Map",
      intuition: "While iterating through the array, we can check if the complement (target - nums[i]) exists in the map. If it does, we return the current index and the complement's index. Otherwise, we insert the current element and its index into the map.",
      timeComplexity: "O(N) - Linear time scan with O(1) hash map operations.",
      spaceComplexity: "O(N) - Storing up to N elements in the map.",
      solutionCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
    },
    testCases: [
      { input: "[2, 7, 11, 15], 9", expected: "[0,1]", isHidden: false },
      { input: "[3, 2, 4], 6", expected: "[1,2]", isHidden: false },
      { input: "[3, 3], 6", expected: "[0,1]", isHidden: false },
      { input: "[1, 5, 8, 12, 19], 20", expected: "[0,4]", isHidden: true },
      { input: "[-3, 4, 3, 90], 0", expected: "[0,2]", isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your code here
  
}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your code here
    pass`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`
    }
  },
  {
    id: "valid-parentheses",
    problemNumber: 2,
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    topics: ["Stack", "Strings"],
    topicSlugs: ["stack", "strings"],
    tags: ["Stack", "String"],
    acceptance: "61.8%",
    rewards: { xp: 20, rating: 15 },
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "Standard matching pair."
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All pairs open and close in correct sequence."
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "Mismatched bracket types."
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    hints: [
      { order: 1, content: "Use a LIFO data structure like a Stack." },
      { order: 2, content: "Push opening brackets. When encountering a closing bracket, check if it matches the top of the stack and pop." }
    ],
    editorial: {
      approach: "Stack Simulation",
      intuition: "A stack naturally matches the most recent opening bracket with the next closing bracket.",
      timeComplexity: "O(N) - Single pass through the string.",
      spaceComplexity: "O(N) - Worst case stack depth.",
      solutionCode: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (pairs[char]) {
      if (stack.pop() !== pairs[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`
    },
    testCases: [
      { input: '"()"', expected: "true", isHidden: false },
      { input: '"()[]{}"', expected: "true", isHidden: false },
      { input: '"(]"', expected: "false", isHidden: false },
      { input: '"{[]}"', expected: "true", isHidden: true },
      { input: '"((("', expected: "false", isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Write your code here
  
}`,
      python: `def isValid(s: str) -> bool:
    # Write your code here
    pass`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your code here
    }
};`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`
    }
  },
  {
    id: "maximum-subarray",
    problemNumber: 3,
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    topics: ["Arrays", "Dynamic Programming"],
    topicSlugs: ["arrays", "dynamic-programming"],
    tags: ["Kadane", "Dynamic Programming", "Array"],
    acceptance: "49.5%",
    rewards: { xp: 35, rating: 25 },
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "Single element max subarray."
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The entire array sums to 23."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    hints: [
      { order: 1, content: "Look into Kadane's Algorithm. Keep track of current sum and max sum found so far." },
      { order: 2, content: "If current sum becomes negative, it's better to restart the subarray from the next element." }
    ],
    editorial: {
      approach: "Kadane's Algorithm",
      intuition: "At each index i, we decide whether to extend the previous subarray or start a new one from nums[i]. max_ending_here = max(nums[i], max_ending_here + nums[i]).",
      timeComplexity: "O(N) - Single linear scan.",
      spaceComplexity: "O(1) - Constant auxiliary memory.",
      solutionCode: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currentMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return maxSoFar;
}`
    },
    testCases: [
      { input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", expected: "6", isHidden: false },
      { input: "[1]", expected: "1", isHidden: false },
      { input: "[5, 4, -1, 7, 8]", expected: "23", isHidden: false },
      { input: "[-1, -2, -3]", expected: "-1", isHidden: true },
      { input: "[10, -2, 3, 4, -10, 20]", expected: "25", isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Write your code here
  
}`,
      python: `def maxSubArray(nums: list[int]) -> int:
    # Write your code here
    pass`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your code here
    }
};`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your code here
        return 0;
    }
}`
    }
  },
  {
    id: "merge-intervals",
    problemNumber: 4,
    title: "Merge Intervals",
    slug: "merge-intervals",
    difficulty: "Medium",
    topics: ["Arrays", "Sorting", "Intervals"],
    topicSlugs: ["arrays", "sorting"],
    tags: ["Intervals", "Sorting", "Greedy"],
    acceptance: "46.1%",
    rewards: { xp: 35, rating: 25 },
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    hints: [
      { order: 1, content: "Sorting intervals by their start time makes overlapping intervals adjacent." },
      { order: 2, content: "Iterate through sorted intervals. If current.start <= prev.end, merge by updating prev.end = max(prev.end, current.end)." }
    ],
    editorial: {
      approach: "Sort and Merge",
      intuition: "By sorting by start times, we guarantee that whenever interval B starts after interval A, we can decide if they overlap by comparing A.end and B.start.",
      timeComplexity: "O(N log N) - Dominated by sorting step.",
      spaceComplexity: "O(N) - To hold output merged intervals.",
      solutionCode: `function merge(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}`
    },
    testCases: [
      { input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]", isHidden: false },
      { input: "[[1,4],[4,5]]", expected: "[[1,5]]", isHidden: false },
      { input: "[[1,4],[2,3]]", expected: "[[1,4]]", isHidden: true },
      { input: "[[6,8],[1,9],[2,4],[4,7]]", expected: "[[1,9]]", isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
  // Write your code here
  
}`,
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Write your code here
    pass`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Write your code here
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your code here
        return new int[][]{};
    }
}`
    }
  },
  {
    id: "longest-substring-without-repeating-characters",
    problemNumber: 5,
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    topics: ["Sliding Window", "Hashing", "Strings"],
    topicSlugs: ["sliding-window", "hashing", "strings"],
    tags: ["Sliding Window", "Hash Set", "String"],
    acceptance: "34.5%",
    rewards: { xp: 35, rating: 25 },
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    hints: [
      { order: 1, content: "Use a sliding window [left, right] and a hash set / map of visited characters." },
      { order: 2, content: "Whenever a duplicate is encountered at 'right', shrink from 'left' until the duplicate is evicted." }
    ],
    editorial: {
      approach: "Sliding Window with Map / Set",
      intuition: "Maintain window boundaries left and right. Expand right to include characters, record maximum window size right - left + 1.",
      timeComplexity: "O(N) - Each character visited at most twice.",
      spaceComplexity: "O(min(N, M)) - Where M is alphabet size.",
      solutionCode: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`
    },
    testCases: [
      { input: '"abcabcbb"', expected: "3", isHidden: false },
      { input: '"bbbbb"', expected: "1", isHidden: false },
      { input: '"pwwkew"', expected: "3", isHidden: false },
      { input: '""', expected: "0", isHidden: true },
      { input: '"tmmzuxt"', expected: "5", isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Write your code here
  
}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your code here
    pass`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your code here
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}`
    }
  },
  {
    id: "reverse-linked-list",
    problemNumber: 6,
    title: "Reverse Linked List",
    slug: "reverse-linked-list",
    difficulty: "Easy",
    topics: ["Linked Lists", "Recursion"],
    topicSlugs: ["linked-lists", "recursion"],
    tags: ["Linked List", "Recursion"],
    acceptance: "74.8%",
    rewards: { xp: 20, rating: 15 },
    description: `Given the \`head\` of a singly linked list (represented as an array of values for test runner), reverse the list, and return *the reversed list*.`,
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "Pointers inverted from head to tail."
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
        explanation: "Two elements reversed."
      },
      {
        input: "head = []",
        output: "[]",
        explanation: "Empty list returns empty list."
      }
    ],
    constraints: [
      "The number of nodes in the list is in the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    hints: [
      { order: 1, content: "Maintain three pointers: prev = null, curr = head, and next." },
      { order: 2, content: "In each step: next = curr.next; curr.next = prev; prev = curr; curr = next." }
    ],
    editorial: {
      approach: "Iterative 3-Pointer Reversal",
      intuition: "By changing each node's next pointer to its predecessor, we reverse the direction of links in place.",
      timeComplexity: "O(N) - Single pass through list nodes.",
      spaceComplexity: "O(1) - Constant pointer mutations.",
      solutionCode: `function reverseList(head) {
  if (Array.isArray(head)) return [...head].reverse();
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`
    },
    testCases: [
      { input: "[1, 2, 3, 4, 5]", expected: "[5,4,3,2,1]", isHidden: false },
      { input: "[1, 2]", expected: "[2,1]", isHidden: false },
      { input: "[]", expected: "[]", isHidden: false },
      { input: "[42]", expected: "[42]", isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} head
 * @return {number[]}
 */
function reverseList(head) {
  // Write your code here
  
}`,
      python: `def reverseList(head: list[int]) -> list[int]:
    # Write your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> reverseList(vector<int>& head) {
        // Write your code here
    }
};`,
      java: `class Solution {
    public int[] reverseList(int[] head) {
        // Write your code here
        return new int[]{};
    }
}`
    }
  },
  {
    id: "climbing-stairs",
    problemNumber: 7,
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy",
    topics: ["Dynamic Programming", "Math"],
    topicSlugs: ["dynamic-programming"],
    tags: ["DP", "Fibonacci"],
    acceptance: "52.4%",
    rewards: { xp: 20, rating: 15 },
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "There are two ways to climb: (1 + 1) or (2)."
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "There are three ways: (1 + 1 + 1), (1 + 2), or (2 + 1)."
      }
    ],
    constraints: ["1 <= n <= 45"],
    hints: [
      { order: 1, content: "To reach step n, you must come from either step (n-1) or step (n-2)." },
      { order: 2, content: "This is identical to Fibonacci: ways(n) = ways(n-1) + ways(n-2)." }
    ],
    editorial: {
      approach: "Bottom-Up Dynamic Programming",
      intuition: "State transition: dp[i] = dp[i-1] + dp[i-2]. We only need two variables to track the previous two values.",
      timeComplexity: "O(N) - Linear loop.",
      spaceComplexity: "O(1) - Constant extra space.",
      solutionCode: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}`
    },
    testCases: [
      { input: "2", expected: "2", isHidden: false },
      { input: "3", expected: "3", isHidden: false },
      { input: "5", expected: "8", isHidden: false },
      { input: "10", expected: "89", isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Write your code here
  
}`,
      python: `def climbStairs(n: int) -> int:
    # Write your code here
    pass`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
    }
};`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }
}`
    }
  },
  {
    id: "coin-change",
    problemNumber: 8,
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Medium",
    topics: ["Dynamic Programming", "Breadth-First Search"],
    topicSlugs: ["dynamic-programming"],
    tags: ["DP", "BFS", "Unbounded Knapsack"],
    acceptance: "42.9%",
    rewards: { xp: 35, rating: 25 },
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1"
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
        explanation: "Cannot make amount 3 with only 2-cent coins."
      },
      {
        input: "coins = [1], amount = 0",
        output: "0",
        explanation: "0 amount requires 0 coins."
      }
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    hints: [
      { order: 1, content: "Build a dp array of size amount + 1, initialized to Infinity, with dp[0] = 0." },
      { order: 2, content: "For each coin and each target i >= coin: dp[i] = min(dp[i], dp[i - coin] + 1)." }
    ],
    editorial: {
      approach: "1D Bottom-Up DP",
      intuition: "The subproblem dp[i] represents the minimum coins to make amount i. For every coin c, dp[i] = min(dp[i], dp[i-c] + 1).",
      timeComplexity: "O(amount * len(coins))",
      spaceComplexity: "O(amount)",
      solutionCode: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`
    },
    testCases: [
      { input: "[1, 2, 5], 11", expected: "3", isHidden: false },
      { input: "[2], 3", expected: "-1", isHidden: false },
      { input: "[1], 0", expected: "0", isHidden: false },
      { input: "[186, 419, 83, 408], 6249", expected: "20", isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // Write your code here
  
}`,
      python: `def coinChange(coins: list[int], amount: int) -> int:
    # Write your code here
    pass`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Write your code here
    }
};`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your code here
        return -1;
    }
}`
    }
  },
  {
    id: "word-ladder",
    problemNumber: 9,
    title: "Word Ladder",
    slug: "word-ladder",
    difficulty: "Hard",
    topics: ["Breadth-First Search", "Graphs", "Strings"],
    topicSlugs: ["graphs", "strings"],
    tags: ["BFS", "Shortest Path", "Graph"],
    acceptance: "38.2%",
    rewards: { xp: 60, rating: 40 },
    description: `A **transformation sequence** from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words \`beginWord -> s1 -> s2 -> ... -> sk\` such that:
- Every adjacent pair of words differs by a single letter.
- Every \`s_i\` for \`1 <= i <= k\` is in \`wordList\`. Note that \`beginWord\` does not need to be in \`wordList\`.
- \`sk == endWord\`

Given two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return *the **number of words** in the **shortest transformation sequence** from \`beginWord\` to \`endWord\`, or \`0\` if no such sequence exists.*`,
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: "5",
        explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.'
      },
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',
        output: "0",
        explanation: 'The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.'
      }
    ],
    constraints: [
      "1 <= beginWord.length <= 10",
      "endWord.length == beginWord.length",
      "1 <= wordList.length <= 5000",
      "wordList[i].length == beginWord.length",
      "beginWord, endWord, and wordList[i] consist of lowercase English letters.",
      "beginWord != endWord",
      "All the words in wordList are unique."
    ],
    hints: [
      { order: 1, content: "This is finding the shortest path in an unweighted graph, which is best solved using Breadth-First Search (BFS)." },
      { order: 2, content: "For each word, try changing each of its characters from 'a' to 'z' to find valid adjacent words in O(26 * L) time." }
    ],
    editorial: {
      approach: "Breadth-First Search (BFS)",
      intuition: "Level-order traversal ensures that the first time we reach endWord, it is guaranteed to be via the shortest sequence.",
      timeComplexity: "O(M^2 * N) where M is word length and N is number of words.",
      spaceComplexity: "O(M * N)",
      solutionCode: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  const queue = [[beginWord, 1]];
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  while (queue.length) {
    const [word, level] = queue.shift();
    if (word === endWord) return level;
    for (let i = 0; i < word.length; i++) {
      for (const char of alphabet) {
        if (char === word[i]) continue;
        const nextWord = word.slice(0, i) + char + word.slice(i + 1);
        if (wordSet.has(nextWord)) {
          wordSet.delete(nextWord);
          queue.push([nextWord, level + 1]);
        }
      }
    }
  }
  return 0;
}`
    },
    testCases: [
      { input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]', expected: "5", isHidden: false },
      { input: '"hit", "cog", ["hot","dot","dog","lot","log"]', expected: "0", isHidden: false },
      { input: '"a", "c", ["a","b","c"]', expected: "2", isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
function ladderLength(beginWord, endWord, wordList) {
  // Write your code here
  
}`,
      python: `def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:
    # Write your code here
    pass`,
      cpp: `#include <string>
#include <vector>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        // Write your code here
    }
};`,
      java: `import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        // Write your code here
        return 0;
    }
}`
    }
  }
];

export const TOPICS = [
  { slug: "all", name: "All Topics", count: 9 },
  { slug: "arrays", name: "Arrays", count: 4 },
  { slug: "strings", name: "Strings", count: 3 },
  { slug: "dynamic-programming", name: "Dynamic Programming", count: 3 },
  { slug: "stack", name: "Stack", count: 1 },
  { slug: "linked-lists", name: "Linked Lists", count: 1 },
  { slug: "sliding-window", name: "Sliding Window", count: 1 },
  { slug: "graphs", name: "Graphs", count: 1 },
  { slug: "hashing", name: "Hashing", count: 2 }
];
