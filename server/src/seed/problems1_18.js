// Canonical DSA Problems #1 to #18
export const PROBLEMS_1_18 = [
  {
    "id": "two-sum",
    "problemNumber": 1,
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "Easy",
    "topics": [
      "Arrays",
      "Hashing"
    ],
    "topicSlugs": [
      "arrays",
      "hashing"
    ],
    "tags": [
      "Array",
      "Hash Table"
    ],
    "acceptance": "54.2%",
    "rewards": {
      "xp": 20,
      "rating": 15
    },
    "description": "Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "output": "[1,2]",
        "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        "input": "nums = [3,3], target = 6",
        "output": "[0,1]",
        "explanation": "nums[0] + nums[1] == 6, returning [0, 1]."
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    "hints": [
      {
        "order": 1,
        "content": "A brute force approach checks every pair, taking O(N^2) time. Can we do better with a hash map?"
      },
      {
        "order": 2,
        "content": "As you iterate through the array, check if (target - current_num) already exists in your map. If so, you found the pair!"
      }
    ],
    "editorial": {
      "approach": "One-Pass Hash Map",
      "intuition": "While iterating through the array, we can check if the complement (target - nums[i]) exists in the map. If it does, we return the current index and the complement's index. Otherwise, we insert the current element and its index into the map.",
      "timeComplexity": "O(N) - Linear time scan with O(1) hash map operations.",
      "spaceComplexity": "O(N) - Storing up to N elements in the map.",
      "solutionCode": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}"
    },
    "testCases": [
      {
        "input": "[2, 7, 11, 15], 9",
        "expected": "[0,1]",
        "isHidden": false
      },
      {
        "input": "[3, 2, 4], 6",
        "expected": "[1,2]",
        "isHidden": false
      },
      {
        "input": "[3, 3], 6",
        "expected": "[0,1]",
        "isHidden": false
      },
      {
        "input": "[1, 5, 8, 12, 19], 20",
        "expected": "[0,4]",
        "isHidden": true
      },
      {
        "input": "[-3, 4, 3, 90], 0",
        "expected": "[0,2]",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Write your code here\n  \n}",
      "python": "def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};",
      "java": "import java.util.HashMap;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}"
    }
  },
  {
    "id": "valid-parentheses",
    "problemNumber": 2,
    "title": "Valid Parentheses",
    "slug": "valid-parentheses",
    "difficulty": "Easy",
    "topics": [
      "Stack",
      "Strings"
    ],
    "topicSlugs": [
      "stack",
      "strings"
    ],
    "tags": [
      "Stack",
      "String"
    ],
    "acceptance": "61.8%",
    "rewards": {
      "xp": 20,
      "rating": 15
    },
    "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    "examples": [
      {
        "input": "s = \"()\"",
        "output": "true",
        "explanation": "Standard matching pair."
      },
      {
        "input": "s = \"()[]{}\"",
        "output": "true",
        "explanation": "All pairs open and close in correct sequence."
      },
      {
        "input": "s = \"(]\"",
        "output": "false",
        "explanation": "Mismatched bracket types."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    "hints": [
      {
        "order": 1,
        "content": "Use a LIFO data structure like a Stack."
      },
      {
        "order": 2,
        "content": "Push opening brackets. When encountering a closing bracket, check if it matches the top of the stack and pop."
      }
    ],
    "editorial": {
      "approach": "Stack Simulation",
      "intuition": "A stack naturally matches the most recent opening bracket with the next closing bracket.",
      "timeComplexity": "O(N) - Single pass through the string.",
      "spaceComplexity": "O(N) - Worst case stack depth.",
      "solutionCode": "function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (const char of s) {\n    if (pairs[char]) {\n      if (stack.pop() !== pairs[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}"
    },
    "testCases": [
      {
        "input": "\"()\"",
        "expected": "true",
        "isHidden": false
      },
      {
        "input": "\"()[]{}\"",
        "expected": "true",
        "isHidden": false
      },
      {
        "input": "\"(]\"",
        "expected": "false",
        "isHidden": false
      },
      {
        "input": "\"{[]}\"",
        "expected": "true",
        "isHidden": true
      },
      {
        "input": "\"(((\"",
        "expected": "false",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n  // Write your code here\n  \n}",
      "python": "def isValid(s: str) -> bool:\n    # Write your code here\n    pass",
      "cpp": "#include <string>\n#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n    }\n};",
      "java": "import java.util.Stack;\n\nclass Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}"
    }
  },
  {
    "id": "maximum-subarray",
    "problemNumber": 3,
    "title": "Maximum Subarray",
    "slug": "maximum-subarray",
    "difficulty": "Medium",
    "topics": [
      "Arrays",
      "Dynamic Programming"
    ],
    "topicSlugs": [
      "arrays",
      "dynamic-programming"
    ],
    "tags": [
      "Kadane",
      "Dynamic Programming",
      "Array"
    ],
    "acceptance": "49.5%",
    "rewards": {
      "xp": 35,
      "rating": 25
    },
    "description": "Given an integer array `nums`, find the subarray with the largest sum, and return *its sum*.\n\nA **subarray** is a contiguous non-empty sequence of elements within an array.",
    "examples": [
      {
        "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "output": "6",
        "explanation": "The subarray [4,-1,2,1] has the largest sum 6."
      },
      {
        "input": "nums = [1]",
        "output": "1",
        "explanation": "Single element max subarray."
      },
      {
        "input": "nums = [5,4,-1,7,8]",
        "output": "23",
        "explanation": "The entire array sums to 23."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "hints": [
      {
        "order": 1,
        "content": "Look into Kadane's Algorithm. Keep track of current sum and max sum found so far."
      },
      {
        "order": 2,
        "content": "If current sum becomes negative, it's better to restart the subarray from the next element."
      }
    ],
    "editorial": {
      "approach": "Kadane's Algorithm",
      "intuition": "At each index i, we decide whether to extend the previous subarray or start a new one from nums[i]. max_ending_here = max(nums[i], max_ending_here + nums[i]).",
      "timeComplexity": "O(N) - Single linear scan.",
      "spaceComplexity": "O(1) - Constant auxiliary memory.",
      "solutionCode": "function maxSubArray(nums) {\n  let maxSoFar = nums[0];\n  let currentMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentMax = Math.max(nums[i], currentMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currentMax);\n  }\n  return maxSoFar;\n}"
    },
    "testCases": [
      {
        "input": "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        "expected": "6",
        "isHidden": false
      },
      {
        "input": "[1]",
        "expected": "1",
        "isHidden": false
      },
      {
        "input": "[5, 4, -1, 7, 8]",
        "expected": "23",
        "isHidden": false
      },
      {
        "input": "[-1, -2, -3]",
        "expected": "-1",
        "isHidden": true
      },
      {
        "input": "[10, -2, 3, 4, -10, 20]",
        "expected": "25",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxSubArray(nums) {\n  // Write your code here\n  \n}",
      "python": "def maxSubArray(nums: list[int]) -> int:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n    }\n};",
      "java": "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    "id": "merge-intervals",
    "problemNumber": 4,
    "title": "Merge Intervals",
    "slug": "merge-intervals",
    "difficulty": "Medium",
    "topics": [
      "Arrays",
      "Sorting",
      "Intervals"
    ],
    "topicSlugs": [
      "arrays",
      "sorting"
    ],
    "tags": [
      "Intervals",
      "Sorting",
      "Greedy"
    ],
    "acceptance": "46.1%",
    "rewards": {
      "xp": 35,
      "rating": 25
    },
    "description": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      {
        "order": 1,
        "content": "Sorting intervals by their start time makes overlapping intervals adjacent."
      },
      {
        "order": 2,
        "content": "Iterate through sorted intervals. If current.start <= prev.end, merge by updating prev.end = max(prev.end, current.end)."
      }
    ],
    "editorial": {
      "approach": "Sort and Merge",
      "intuition": "By sorting by start times, we guarantee that whenever interval B starts after interval A, we can decide if they overlap by comparing A.end and B.start.",
      "timeComplexity": "O(N log N) - Dominated by sorting step.",
      "spaceComplexity": "O(N) - To hold output merged intervals.",
      "solutionCode": "function merge(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const current = intervals[i];\n    const last = merged[merged.length - 1];\n    if (current[0] <= last[1]) {\n      last[1] = Math.max(last[1], current[1]);\n    } else {\n      merged.push(current);\n    }\n  }\n  return merged;\n}"
    },
    "testCases": [
      {
        "input": "[[1,3],[2,6],[8,10],[15,18]]",
        "expected": "[[1,6],[8,10],[15,18]]",
        "isHidden": false
      },
      {
        "input": "[[1,4],[4,5]]",
        "expected": "[[1,5]]",
        "isHidden": false
      },
      {
        "input": "[[1,4],[2,3]]",
        "expected": "[[1,4]]",
        "isHidden": true
      },
      {
        "input": "[[6,8],[1,9],[2,4],[4,7]]",
        "expected": "[[1,9]]",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction merge(intervals) {\n  // Write your code here\n  \n}",
      "python": "def merge(intervals: list[list[int]]) -> list[list[int]]:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your code here\n    }\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your code here\n        return new int[][]{};\n    }\n}"
    }
  },
  {
    "id": "longest-substring-without-repeating-characters",
    "problemNumber": 5,
    "title": "Longest Substring Without Repeating Characters",
    "slug": "longest-substring-without-repeating-characters",
    "difficulty": "Medium",
    "topics": [
      "Sliding Window",
      "Hashing",
      "Strings"
    ],
    "topicSlugs": [
      "sliding-window",
      "hashing",
      "strings"
    ],
    "tags": [
      "Sliding Window",
      "Hash Set",
      "String"
    ],
    "acceptance": "34.5%",
    "rewards": {
      "xp": 35,
      "rating": 25
    },
    "description": "Given a string `s`, find the length of the **longest substring** without duplicate characters.",
    "examples": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3",
        "explanation": "The answer is \"abc\", with the length of 3."
      },
      {
        "input": "s = \"bbbbb\"",
        "output": "1",
        "explanation": "The answer is \"b\", with the length of 1."
      },
      {
        "input": "s = \"pwwkew\"",
        "output": "3",
        "explanation": "The answer is \"wke\", with the length of 3."
      }
    ],
    "constraints": [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    "hints": [
      {
        "order": 1,
        "content": "Use a sliding window [left, right] and a hash set / map of visited characters."
      },
      {
        "order": 2,
        "content": "Whenever a duplicate is encountered at 'right', shrink from 'left' until the duplicate is evicted."
      }
    ],
    "editorial": {
      "approach": "Sliding Window with Map / Set",
      "intuition": "Maintain window boundaries left and right. Expand right to include characters, record maximum window size right - left + 1.",
      "timeComplexity": "O(N) - Each character visited at most twice.",
      "spaceComplexity": "O(min(N, M)) - Where M is alphabet size.",
      "solutionCode": "function lengthOfLongestSubstring(s) {\n  const map = new Map();\n  let maxLen = 0;\n  let left = 0;\n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    if (map.has(char) && map.get(char) >= left) {\n      left = map.get(char) + 1;\n    }\n    map.set(char, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}"
    },
    "testCases": [
      {
        "input": "\"abcabcbb\"",
        "expected": "3",
        "isHidden": false
      },
      {
        "input": "\"bbbbb\"",
        "expected": "1",
        "isHidden": false
      },
      {
        "input": "\"pwwkew\"",
        "expected": "3",
        "isHidden": false
      },
      {
        "input": "\"\"",
        "expected": "0",
        "isHidden": true
      },
      {
        "input": "\"tmmzuxt\"",
        "expected": "5",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n  // Write your code here\n  \n}",
      "python": "def lengthOfLongestSubstring(s: str) -> int:\n    # Write your code here\n    pass",
      "cpp": "#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your code here\n    }\n};",
      "java": "import java.util.HashMap;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    "id": "reverse-linked-list",
    "problemNumber": 6,
    "title": "Reverse Linked List",
    "slug": "reverse-linked-list",
    "difficulty": "Easy",
    "topics": [
      "Linked Lists",
      "Recursion"
    ],
    "topicSlugs": [
      "linked-lists",
      "recursion"
    ],
    "tags": [
      "Linked List",
      "Recursion"
    ],
    "acceptance": "74.8%",
    "rewards": {
      "xp": 20,
      "rating": 15
    },
    "description": "Given the `head` of a singly linked list (represented as an array of values for test runner), reverse the list, and return *the reversed list*.",
    "examples": [
      {
        "input": "head = [1,2,3,4,5]",
        "output": "[5,4,3,2,1]",
        "explanation": "Pointers inverted from head to tail."
      },
      {
        "input": "head = [1,2]",
        "output": "[2,1]",
        "explanation": "Two elements reversed."
      },
      {
        "input": "head = []",
        "output": "[]",
        "explanation": "Empty list returns empty list."
      }
    ],
    "constraints": [
      "The number of nodes in the list is in the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    "hints": [
      {
        "order": 1,
        "content": "Maintain three pointers: prev = null, curr = head, and next."
      },
      {
        "order": 2,
        "content": "In each step: next = curr.next; curr.next = prev; prev = curr; curr = next."
      }
    ],
    "editorial": {
      "approach": "Iterative 3-Pointer Reversal",
      "intuition": "By changing each node's next pointer to its predecessor, we reverse the direction of links in place.",
      "timeComplexity": "O(N) - Single pass through list nodes.",
      "spaceComplexity": "O(1) - Constant pointer mutations.",
      "solutionCode": "function reverseList(head) {\n  if (Array.isArray(head)) return [...head].reverse();\n  let prev = null;\n  let curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}"
    },
    "testCases": [
      {
        "input": "[1, 2, 3, 4, 5]",
        "expected": "[5,4,3,2,1]",
        "isHidden": false
      },
      {
        "input": "[1, 2]",
        "expected": "[2,1]",
        "isHidden": false
      },
      {
        "input": "[]",
        "expected": "[]",
        "isHidden": false
      },
      {
        "input": "[42]",
        "expected": "[42]",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[]} head\n * @return {number[]}\n */\nfunction reverseList(head) {\n  // Write your code here\n  \n}",
      "python": "def reverseList(head: list[int]) -> list[int]:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> reverseList(vector<int>& head) {\n        // Write your code here\n    }\n};",
      "java": "class Solution {\n    public int[] reverseList(int[] head) {\n        // Write your code here\n        return new int[]{};\n    }\n}"
    }
  },
  {
    "id": "climbing-stairs",
    "problemNumber": 7,
    "title": "Climbing Stairs",
    "slug": "climbing-stairs",
    "difficulty": "Easy",
    "topics": [
      "Dynamic Programming",
      "Math"
    ],
    "topicSlugs": [
      "dynamic-programming"
    ],
    "tags": [
      "DP",
      "Fibonacci"
    ],
    "acceptance": "52.4%",
    "rewards": {
      "xp": 20,
      "rating": 15
    },
    "description": "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    "examples": [
      {
        "input": "n = 2",
        "output": "2",
        "explanation": "There are two ways to climb: (1 + 1) or (2)."
      },
      {
        "input": "n = 3",
        "output": "3",
        "explanation": "There are three ways: (1 + 1 + 1), (1 + 2), or (2 + 1)."
      }
    ],
    "constraints": [
      "1 <= n <= 45"
    ],
    "hints": [
      {
        "order": 1,
        "content": "To reach step n, you must come from either step (n-1) or step (n-2)."
      },
      {
        "order": 2,
        "content": "This is identical to Fibonacci: ways(n) = ways(n-1) + ways(n-2)."
      }
    ],
    "editorial": {
      "approach": "Bottom-Up Dynamic Programming",
      "intuition": "State transition: dp[i] = dp[i-1] + dp[i-2]. We only need two variables to track the previous two values.",
      "timeComplexity": "O(N) - Linear loop.",
      "spaceComplexity": "O(1) - Constant extra space.",
      "solutionCode": "function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    const c = a + b;\n    a = b;\n    b = c;\n  }\n  return b;\n}"
    },
    "testCases": [
      {
        "input": "2",
        "expected": "2",
        "isHidden": false
      },
      {
        "input": "3",
        "expected": "3",
        "isHidden": false
      },
      {
        "input": "5",
        "expected": "8",
        "isHidden": false
      },
      {
        "input": "10",
        "expected": "89",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number} n\n * @return {number}\n */\nfunction climbStairs(n) {\n  // Write your code here\n  \n}",
      "python": "def climbStairs(n: int) -> int:\n    # Write your code here\n    pass",
      "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your code here\n    }\n};",
      "java": "class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    "id": "coin-change",
    "problemNumber": 8,
    "title": "Coin Change",
    "slug": "coin-change",
    "difficulty": "Medium",
    "topics": [
      "Dynamic Programming",
      "Breadth-First Search"
    ],
    "topicSlugs": [
      "dynamic-programming"
    ],
    "tags": [
      "DP",
      "BFS",
      "Unbounded Knapsack"
    ],
    "acceptance": "42.9%",
    "rewards": {
      "xp": 35,
      "rating": 25
    },
    "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    "examples": [
      {
        "input": "coins = [1,2,5], amount = 11",
        "output": "3",
        "explanation": "11 = 5 + 5 + 1"
      },
      {
        "input": "coins = [2], amount = 3",
        "output": "-1",
        "explanation": "Cannot make amount 3 with only 2-cent coins."
      },
      {
        "input": "coins = [1], amount = 0",
        "output": "0",
        "explanation": "0 amount requires 0 coins."
      }
    ],
    "constraints": [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    "hints": [
      {
        "order": 1,
        "content": "Build a dp array of size amount + 1, initialized to Infinity, with dp[0] = 0."
      },
      {
        "order": 2,
        "content": "For each coin and each target i >= coin: dp[i] = min(dp[i], dp[i - coin] + 1)."
      }
    ],
    "editorial": {
      "approach": "1D Bottom-Up DP",
      "intuition": "The subproblem dp[i] represents the minimum coins to make amount i. For every coin c, dp[i] = min(dp[i], dp[i-c] + 1).",
      "timeComplexity": "O(amount * len(coins))",
      "spaceComplexity": "O(amount)",
      "solutionCode": "function coinChange(coins, amount) {\n  const dp = Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i - coin >= 0) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}"
    },
    "testCases": [
      {
        "input": "[1, 2, 5], 11",
        "expected": "3",
        "isHidden": false
      },
      {
        "input": "[2], 3",
        "expected": "-1",
        "isHidden": false
      },
      {
        "input": "[1], 0",
        "expected": "0",
        "isHidden": false
      },
      {
        "input": "[186, 419, 83, 408], 6249",
        "expected": "20",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nfunction coinChange(coins, amount) {\n  // Write your code here\n  \n}",
      "python": "def coinChange(coins: list[int], amount: int) -> int:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your code here\n    }\n};",
      "java": "import java.util.Arrays;\n\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your code here\n        return -1;\n    }\n}"
    }
  },
  {
    "id": "word-ladder",
    "problemNumber": 9,
    "title": "Word Ladder",
    "slug": "word-ladder",
    "difficulty": "Hard",
    "topics": [
      "Breadth-First Search",
      "Graphs",
      "Strings"
    ],
    "topicSlugs": [
      "graphs",
      "strings"
    ],
    "tags": [
      "BFS",
      "Shortest Path",
      "Graph"
    ],
    "acceptance": "38.2%",
    "rewards": {
      "xp": 60,
      "rating": 40
    },
    "description": "A **transformation sequence** from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:\n- Every adjacent pair of words differs by a single letter.\n- Every `s_i` for `1 <= i <= k` is in `wordList`. Note that `beginWord` does not need to be in `wordList`.\n- `sk == endWord`\n\nGiven two words, `beginWord` and `endWord`, and a dictionary `wordList`, return *the **number of words** in the **shortest transformation sequence** from `beginWord` to `endWord`, or `0` if no such sequence exists.*",
    "examples": [
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "output": "5",
        "explanation": "One shortest transformation sequence is \"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> \"cog\", which is 5 words long."
      },
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
        "output": "0",
        "explanation": "The endWord \"cog\" is not in wordList, therefore there is no valid transformation sequence."
      }
    ],
    "constraints": [
      "1 <= beginWord.length <= 10",
      "endWord.length == beginWord.length",
      "1 <= wordList.length <= 5000",
      "wordList[i].length == beginWord.length",
      "beginWord, endWord, and wordList[i] consist of lowercase English letters.",
      "beginWord != endWord",
      "All the words in wordList are unique."
    ],
    "hints": [
      {
        "order": 1,
        "content": "This is finding the shortest path in an unweighted graph, which is best solved using Breadth-First Search (BFS)."
      },
      {
        "order": 2,
        "content": "For each word, try changing each of its characters from 'a' to 'z' to find valid adjacent words in O(26 * L) time."
      }
    ],
    "editorial": {
      "approach": "Breadth-First Search (BFS)",
      "intuition": "Level-order traversal ensures that the first time we reach endWord, it is guaranteed to be via the shortest sequence.",
      "timeComplexity": "O(M^2 * N) where M is word length and N is number of words.",
      "spaceComplexity": "O(M * N)",
      "solutionCode": "function ladderLength(beginWord, endWord, wordList) {\n  const wordSet = new Set(wordList);\n  if (!wordSet.has(endWord)) return 0;\n  const queue = [[beginWord, 1]];\n  const alphabet = 'abcdefghijklmnopqrstuvwxyz';\n  while (queue.length) {\n    const [word, level] = queue.shift();\n    if (word === endWord) return level;\n    for (let i = 0; i < word.length; i++) {\n      for (const char of alphabet) {\n        if (char === word[i]) continue;\n        const nextWord = word.slice(0, i) + char + word.slice(i + 1);\n        if (wordSet.has(nextWord)) {\n          wordSet.delete(nextWord);\n          queue.push([nextWord, level + 1]);\n        }\n      }\n    }\n  }\n  return 0;\n}"
    },
    "testCases": [
      {
        "input": "\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "expected": "5",
        "isHidden": false
      },
      {
        "input": "\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
        "expected": "0",
        "isHidden": false
      },
      {
        "input": "\"a\", \"c\", [\"a\",\"b\",\"c\"]",
        "expected": "2",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {string} beginWord\n * @param {string} endWord\n * @param {string[]} wordList\n * @return {number}\n */\nfunction ladderLength(beginWord, endWord, wordList) {\n  // Write your code here\n  \n}",
      "python": "def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:\n    # Write your code here\n    pass",
      "cpp": "#include <string>\n#include <vector>\n#include <unordered_set>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        // Write your code here\n    }\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    "id": "best-time-to-buy-and-sell-stock",
    "problemNumber": 10,
    "title": "Best Time to Buy and Sell Stock",
    "slug": "best-time-to-buy-and-sell-stock",
    "difficulty": "Easy",
    "topics": [
      "Arrays",
      "Greedy"
    ],
    "topicSlugs": [
      "arrays",
      "greedy"
    ],
    "tags": [
      "Array",
      "Dynamic Programming"
    ],
    "acceptance": "54.8%",
    "rewards": {
      "xp": 20,
      "rating": 15
    },
    "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return `0`.",
    "examples": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "5",
        "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      },
      {
        "input": "prices = [7,6,4,3,1]",
        "output": "0",
        "explanation": "In this case, no transactions are done and the max profit = 0."
      }
    ],
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "hints": [
      {
        "order": 1,
        "content": "Can you track the minimum buying price seen so far as you iterate through the array?"
      }
    ],
    "editorial": {
      "approach": "One-Pass Greedy",
      "intuition": "Maintain minPrice seen so far and calculate prices[i] - minPrice at each step.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)",
      "solutionCode": "function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxP = 0;\n  for (let p of prices) {\n    if (p < minPrice) minPrice = p;\n    else if (p - minPrice > maxP) maxP = p - minPrice;\n  }\n  return maxP;\n}"
    },
    "testCases": [
      {
        "input": "[7,1,5,3,6,4]",
        "expected": "5",
        "isHidden": false
      },
      {
        "input": "[7,6,4,3,1]",
        "expected": "0",
        "isHidden": false
      },
      {
        "input": "[2,4,1]",
        "expected": "2",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n  // Write your code here\n  \n}",
      "python": "def maxProfit(prices: list[int]) -> int:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your code here\n    }\n};",
      "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    "id": "product-of-array-except-self",
    "problemNumber": 11,
    "title": "Product of Array Except Self",
    "slug": "product-of-array-except-self",
    "difficulty": "Medium",
    "topics": [
      "Arrays",
      "Prefix Sum"
    ],
    "topicSlugs": [
      "arrays"
    ],
    "tags": [
      "Array",
      "Prefix Sum"
    ],
    "acceptance": "65.4%",
    "rewards": {
      "xp": 35,
      "rating": 22
    },
    "description": "Given an integer array `nums`, return *an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`*.\n\nThe product of any prefix or suffix of `nums` is **guaranteed** to fit in a **32-bit** integer.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.",
    "examples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[24,12,8,6]",
        "explanation": "2*3*4=24, 1*3*4=12, 1*2*4=8, 1*2*3=6."
      },
      {
        "input": "nums = [-1,1,0,-3,3]",
        "output": "[0,0,9,0,0]",
        "explanation": "Product except 0 yields 9."
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30"
    ],
    "hints": [
      {
        "order": 1,
        "content": "Compute prefix products in one pass, then suffix products in a backward pass."
      }
    ],
    "editorial": {
      "approach": "Prefix & Suffix Products",
      "intuition": "Store left product prefix, then multiply by running right product suffix.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1) auxiliary",
      "solutionCode": "function productExceptSelf(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(1);\n  let left = 1;\n  for (let i = 0; i < n; i++) {\n    res[i] = left;\n    left *= nums[i];\n  }\n  let right = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    res[i] *= right;\n    right *= nums[i];\n  }\n  return res;\n}"
    },
    "testCases": [
      {
        "input": "[1,2,3,4]",
        "expected": "[24,12,8,6]",
        "isHidden": false
      },
      {
        "input": "[-1,1,0,-3,3]",
        "expected": "[0,0,9,0,0]",
        "isHidden": false
      },
      {
        "input": "[2,3,5,0]",
        "expected": "[0,0,0,30]",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction productExceptSelf(nums) {\n  // Write your code here\n  \n}",
      "python": "def productExceptSelf(nums: list[int]) -> list[int]:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Write your code here\n    }\n};",
      "java": "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your code here\n        return new int[0];\n    }\n}"
    }
  },
  {
    "id": "container-with-most-water",
    "problemNumber": 12,
    "title": "Container With Most Water",
    "slug": "container-with-most-water",
    "difficulty": "Medium",
    "topics": [
      "Arrays",
      "Two Pointers"
    ],
    "topicSlugs": [
      "arrays"
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Greedy"
    ],
    "acceptance": "54.1%",
    "rewards": {
      "xp": 35,
      "rating": 22
    },
    "description": "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn *the maximum amount of water a container can store*.",
    "examples": [
      {
        "input": "height = [1,8,6,2,5,4,8,3,7]",
        "output": "49",
        "explanation": "The max area is between index 1 (height 8) and index 8 (height 7): min(8, 7) * (8 - 1) = 49."
      },
      {
        "input": "height = [1,1]",
        "output": "1",
        "explanation": "min(1, 1) * 1 = 1."
      }
    ],
    "constraints": [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    "hints": [
      {
        "order": 1,
        "content": "Start with maximum width (pointers at opposite ends) and move the pointer pointing to the shorter line inward."
      }
    ],
    "editorial": {
      "approach": "Two Pointers",
      "intuition": "Width shrinks with every step, so we must advance the shorter height to have any hope of finding a larger area.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)",
      "solutionCode": "function maxArea(height) {\n  let left = 0, right = height.length - 1;\n  let maxA = 0;\n  while (left < right) {\n    const h = Math.min(height[left], height[right]);\n    maxA = Math.max(maxA, h * (right - left));\n    if (height[left] < height[right]) left++;\n    else right--;\n  }\n  return maxA;\n}"
    },
    "testCases": [
      {
        "input": "[1,8,6,2,5,4,8,3,7]",
        "expected": "49",
        "isHidden": false
      },
      {
        "input": "[1,1]",
        "expected": "1",
        "isHidden": false
      },
      {
        "input": "[4,3,2,1,4]",
        "expected": "16",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction maxArea(height) {\n  // Write your code here\n  \n}",
      "python": "def maxArea(height: list[int]) -> int:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Write your code here\n    }\n};",
      "java": "class Solution {\n    public int maxArea(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    "id": "trapping-rain-water",
    "problemNumber": 13,
    "title": "Trapping Rain Water",
    "slug": "trapping-rain-water",
    "difficulty": "Hard",
    "topics": [
      "Arrays",
      "Two Pointers",
      "Stack"
    ],
    "topicSlugs": [
      "arrays",
      "stack"
    ],
    "tags": [
      "Array",
      "Two Pointers",
      "Dynamic Programming",
      "Monotonic Stack"
    ],
    "acceptance": "60.2%",
    "rewards": {
      "xp": 60,
      "rating": 35
    },
    "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
    "examples": [
      {
        "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6",
        "explanation": "The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped."
      },
      {
        "input": "height = [4,2,0,3,2,5]",
        "output": "9",
        "explanation": "9 units of rain water trapped."
      }
    ],
    "constraints": [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    "hints": [
      {
        "order": 1,
        "content": "Water trapped at index i is determined by min(maxLeft, maxRight) - height[i]."
      }
    ],
    "editorial": {
      "approach": "Two Pointers Optimal",
      "intuition": "Track leftMax and rightMax. Process whichever side has the lower boundary.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)",
      "solutionCode": "function trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0;\n  let water = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      if (height[left] >= leftMax) leftMax = height[left];\n      else water += leftMax - height[left];\n      left++;\n    } else {\n      if (height[right] >= rightMax) rightMax = height[right];\n      else water += rightMax - height[right];\n      right--;\n    }\n  }\n  return water;\n}"
    },
    "testCases": [
      {
        "input": "[0,1,0,2,1,0,1,3,2,1,2,1]",
        "expected": "6",
        "isHidden": false
      },
      {
        "input": "[4,2,0,3,2,5]",
        "expected": "9",
        "isHidden": false
      },
      {
        "input": "[3,0,2,0,4]",
        "expected": "7",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction trap(height) {\n  // Write your code here\n  \n}",
      "python": "def trap(height: list[int]) -> int:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your code here\n    }\n};",
      "java": "class Solution {\n    public int trap(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    "id": "spiral-matrix",
    "problemNumber": 14,
    "title": "Spiral Matrix",
    "slug": "spiral-matrix",
    "difficulty": "Medium",
    "topics": [
      "Matrix",
      "Simulation"
    ],
    "topicSlugs": [
      "arrays"
    ],
    "tags": [
      "Array",
      "Matrix",
      "Simulation"
    ],
    "acceptance": "48.2%",
    "rewards": {
      "xp": 35,
      "rating": 20
    },
    "description": "Given an `m x n` `matrix`, return *all elements of the `matrix` in spiral order*.",
    "examples": [
      {
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[1,2,3,6,9,8,7,4,5]",
        "explanation": "Traverse right, down, left, up."
      }
    ],
    "constraints": [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 10",
      "-100 <= matrix[i][j] <= 100"
    ],
    "hints": [
      {
        "order": 1,
        "content": "Maintain 4 boundary pointers: top, bottom, left, right, and advance them inward after each sweep."
      }
    ],
    "editorial": {
      "approach": "Boundary Simulation",
      "intuition": "Iterate across top row, right column, bottom row, left column, then increment/decrement the boundaries.",
      "timeComplexity": "O(M * N)",
      "spaceComplexity": "O(1)",
      "solutionCode": "function spiralOrder(matrix) {\n  const res = [];\n  if (!matrix.length) return res;\n  let top = 0, bottom = matrix.length - 1;\n  let left = 0, right = matrix[0].length - 1;\n  while (top <= bottom && left <= right) {\n    for (let c = left; c <= right; c++) res.push(matrix[top][c]);\n    top++;\n    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);\n    right--;\n    if (top <= bottom) {\n      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);\n      bottom--;\n    }\n    if (left <= right) {\n      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);\n      left++;\n    }\n  }\n  return res;\n}"
    },
    "testCases": [
      {
        "input": "[[1,2,3],[4,5,6],[7,8,9]]",
        "expected": "[1,2,3,6,9,8,7,4,5]",
        "isHidden": false
      },
      {
        "input": "[[1,2],[3,4]]",
        "expected": "[1,2,4,3]",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expected": "[1]",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[][]} matrix\n * @return {number[]}\n */\nfunction spiralOrder(matrix) {\n  // Write your code here\n  \n}",
      "python": "def spiralOrder(matrix: list[list[int]]) -> list[int]:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        // Write your code here\n    }\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}"
    }
  },
  {
    "id": "search-in-rotated-sorted-array",
    "problemNumber": 15,
    "title": "Search in Rotated Sorted Array",
    "slug": "search-in-rotated-sorted-array",
    "difficulty": "Medium",
    "topics": [
      "Searching",
      "Binary Search"
    ],
    "topicSlugs": [
      "arrays"
    ],
    "tags": [
      "Array",
      "Binary Search"
    ],
    "acceptance": "40.3%",
    "rewards": {
      "xp": 35,
      "rating": 22
    },
    "description": "There is an integer array `nums` sorted in ascending order (with **distinct** values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k`.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return *the index of `target` if it is in `nums`, or `-1` if it is not in `nums`*.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 0",
        "output": "4",
        "explanation": "0 is at index 4."
      },
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 3",
        "output": "-1",
        "explanation": "3 is not in nums."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique."
    ],
    "hints": [
      {
        "order": 1,
        "content": "In any rotated sorted array, at least one half (left or right) is guaranteed to be strictly sorted."
      }
    ],
    "editorial": {
      "approach": "Modified Binary Search",
      "intuition": "Check which half is normally sorted, then determine whether the target lies within that sorted range.",
      "timeComplexity": "O(log N)",
      "spaceComplexity": "O(1)",
      "solutionCode": "function search(nums, target) {\n  let low = 0, high = nums.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[low] <= nums[mid]) {\n      if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n      else low = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n      else high = mid - 1;\n    }\n  }\n  return -1;\n}"
    },
    "testCases": [
      {
        "input": "[4,5,6,7,0,1,2], 0",
        "expected": "4",
        "isHidden": false
      },
      {
        "input": "[4,5,6,7,0,1,2], 3",
        "expected": "-1",
        "isHidden": false
      },
      {
        "input": "[1], 0",
        "expected": "-1",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n  // Write your code here\n  \n}",
      "python": "def search(nums: list[int], target: int) -> int:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};",
      "java": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}"
    }
  },
  {
    "id": "invert-binary-tree",
    "problemNumber": 16,
    "title": "Invert Binary Tree",
    "slug": "invert-binary-tree",
    "difficulty": "Easy",
    "topics": [
      "Trees",
      "Recursion"
    ],
    "topicSlugs": [
      "graphs"
    ],
    "tags": [
      "Tree",
      "Depth-First Search",
      "Breadth-First Search",
      "Binary Tree"
    ],
    "acceptance": "76.8%",
    "rewards": {
      "xp": 20,
      "rating": 12
    },
    "description": "Given the `root` of a binary tree, invert the tree, and return *its root*.",
    "examples": [
      {
        "input": "root = [4,2,7,1,3,6,9]",
        "output": "[4,7,2,9,6,3,1]",
        "explanation": "Swap left and right children recursively."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      {
        "order": 1,
        "content": "Recursively swap the left child and right child of every node."
      }
    ],
    "editorial": {
      "approach": "DFS Recursion",
      "intuition": "Swap left and right subtrees, then recurse on both children.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(H) call stack",
      "solutionCode": "function invertTree(root) {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}"
    },
    "testCases": [
      {
        "input": "[4,2,7,1,3,6,9]",
        "expected": "[4,7,2,9,6,3,1]",
        "isHidden": false
      },
      {
        "input": "[2,1,3]",
        "expected": "[2,3,1]",
        "isHidden": false
      },
      {
        "input": "[]",
        "expected": "[]",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n * @param {TreeNode} root\n * @return {TreeNode}\n */\nfunction invertTree(root) {\n  // Write your code here\n  \n}",
      "python": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef invertTree(root: TreeNode) -> TreeNode:\n    # Write your code here\n    pass",
      "cpp": "struct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nclass Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Write your code here\n    }\n};",
      "java": "class TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    TreeNode(int x) { val = x; }\n}\n\nclass Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Write your code here\n        return root;\n    }\n}"
    }
  },
  {
    "id": "number-of-islands",
    "problemNumber": 17,
    "title": "Number of Islands",
    "slug": "number-of-islands",
    "difficulty": "Medium",
    "topics": [
      "Graphs",
      "BFS/DFS"
    ],
    "topicSlugs": [
      "graphs"
    ],
    "tags": [
      "Array",
      "Depth-First Search",
      "Breadth-First Search",
      "Union Find",
      "Matrix"
    ],
    "acceptance": "58.1%",
    "rewards": {
      "xp": 40,
      "rating": 24
    },
    "description": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return *the number of islands*.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [\n  [\"1\",\"1\",\"1\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"0\",\"0\"]\n]",
        "output": "1",
        "explanation": "All 1s belong to one connected island."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    "hints": [
      {
        "order": 1,
        "content": "Iterate through the grid. When you hit a '1', increment your island counter and flood-fill (sink) the entire island using DFS or BFS."
      }
    ],
    "editorial": {
      "approach": "DFS Flood Fill",
      "intuition": "Sink each discovered island by marking all connected land cells as '0'.",
      "timeComplexity": "O(M * N)",
      "spaceComplexity": "O(M * N)",
      "solutionCode": "function numIslands(grid) {\n  if (!grid || !grid.length) return 0;\n  let count = 0;\n  const dfs = (r, c) => {\n    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  };\n  for (let r = 0; r < grid.length; r++) {\n    for (let c = 0; c < grid[0].length; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}"
    },
    "testCases": [
      {
        "input": "[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]",
        "expected": "1",
        "isHidden": false
      },
      {
        "input": "[[\"1\",\"0\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"0\",\"1\"]]",
        "expected": "5",
        "isHidden": false
      },
      {
        "input": "[[\"0\",\"0\"],[\"0\",\"0\"]]",
        "expected": "0",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {character[][]} grid\n * @return {number}\n */\nfunction numIslands(grid) {\n  // Write your code here\n  \n}",
      "python": "def numIslands(grid: list[list[str]]) -> int:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your code here\n    }\n};",
      "java": "class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  },
  {
    "id": "longest-increasing-subsequence",
    "problemNumber": 18,
    "title": "Longest Increasing Subsequence",
    "slug": "longest-increasing-subsequence",
    "difficulty": "Medium",
    "topics": [
      "Dynamic Programming",
      "Binary Search"
    ],
    "topicSlugs": [
      "dynamic-programming"
    ],
    "tags": [
      "Array",
      "Binary Search",
      "Dynamic Programming"
    ],
    "acceptance": "54.6%",
    "rewards": {
      "xp": 45,
      "rating": 26
    },
    "description": "Given an integer array `nums`, return *the length of the longest strictly increasing subsequence*.",
    "examples": [
      {
        "input": "nums = [10,9,2,5,3,7,101,18]",
        "output": "4",
        "explanation": "The longest increasing subsequence is [2,3,7,101], therefore the length is 4."
      },
      {
        "input": "nums = [0,1,0,3,2,3]",
        "output": "4",
        "explanation": "The longest increasing subsequence is [0,1,2,3]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "hints": [
      {
        "order": 1,
        "content": "Can you maintain a tails array where tails[i] stores the smallest tail of all increasing subsequences of length i+1?"
      }
    ],
    "editorial": {
      "approach": "Patience Sorting / Binary Search",
      "intuition": "Maintain an array 'tails' and use binary search (bisect_left) to replace the first element >= x.",
      "timeComplexity": "O(N log N)",
      "spaceComplexity": "O(N)",
      "solutionCode": "function lengthOfLIS(nums) {\n  const tails = [];\n  for (const x of nums) {\n    let l = 0, r = tails.length;\n    while (l < r) {\n      const mid = (l + r) >> 1;\n      if (tails[mid] < x) l = mid + 1;\n      else r = mid;\n    }\n    tails[l] = x;\n  }\n  return tails.length;\n}"
    },
    "testCases": [
      {
        "input": "[10,9,2,5,3,7,101,18]",
        "expected": "4",
        "isHidden": false
      },
      {
        "input": "[0,1,0,3,2,3]",
        "expected": "4",
        "isHidden": false
      },
      {
        "input": "[7,7,7,7,7,7,7]",
        "expected": "1",
        "isHidden": true
      }
    ],
    "starterCode": {
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction lengthOfLIS(nums) {\n  // Write your code here\n  \n}",
      "python": "def lengthOfLIS(nums: list[int]) -> int:\n    # Write your code here\n    pass",
      "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        // Write your code here\n    }\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    public int lengthOfLIS(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}"
    }
  }
];
