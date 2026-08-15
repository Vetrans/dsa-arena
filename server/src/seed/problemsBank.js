export const EXTENDED_PROBLEMS = [
  {
    problemNumber: 9,
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    topicSlugs: ['arrays', 'dynamic-programming', 'prefix-sum'],
    tags: ['Kadane', 'Dynamic Programming', 'Array'],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.\n\nA **subarray** is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.' },
      { input: '[1]', output: '1', explanation: 'The subarray [1] has the largest sum 1.' },
      { input: '[5, 4, -1, 7, 8]', output: '23', explanation: 'The subarray [5, 4, -1, 7, 8] has the largest sum 23.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      { order: 1, content: "Look into Kadane's Algorithm. Keep track of current sum and max sum found so far." },
      { order: 2, content: 'At each element, decide whether to add it to the running sum or start a new subarray.' }
    ],
    editorial: {
      approach: "Kadane's Algorithm (Linear DP)",
      intuition: 'If current sum becomes negative, reset it to 0 because continuing will only decrease subsequent sums.',
      complexity: { time: 'O(N)', space: 'O(1)' }
    },
    testCases: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected: '6', isHidden: false },
      { input: '[1]', expected: '1', isHidden: false },
      { input: '[-1]', expected: '-1', isHidden: true },
      { input: '[5, 4, -1, 7, 8]', expected: '23', isHidden: true }
    ],
    starterCode: {
      javascript: 'function maxSubArray(nums) {\n  // Write your code here\n}',
      python: 'def maxSubArray(nums: list[int]) -> int:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}'
    },
    rewards: { xp: 30, rating: 25 }
  },
  {
    problemNumber: 10,
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    topicSlugs: ['linked-lists', 'recursion'],
    tags: ['Linked List', 'Recursion'],
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      { input: '[1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]', explanation: 'Reversed node pointers from tail to head.' },
      { input: '[1, 2]', output: '[2, 1]', explanation: '2 -> 1' }
    ],
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    hints: [
      { order: 1, content: 'Maintain prev, curr, and next pointers.' },
      { order: 2, content: 'Point curr.next to prev, then advance prev = curr, curr = next.' }
    ],
    editorial: {
      approach: 'Iterative 3-Pointer Reversal',
      intuition: 'Change the next pointer of each node to point to its predecessor.',
      complexity: { time: 'O(N)', space: 'O(1)' }
    },
    testCases: [
      { input: '[1, 2, 3, 4, 5]', expected: '[5,4,3,2,1]', isHidden: false },
      { input: '[1, 2]', expected: '[2,1]', isHidden: false },
      { input: '[]', expected: '[]', isHidden: true }
    ],
    starterCode: {
      javascript: 'function reverseList(head) {\n  // Write your code here\n}',
      python: 'def reverseList(head):\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}'
    },
    rewards: { xp: 15, rating: 10 }
  },
  {
    problemNumber: 11,
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    topicSlugs: ['linked-lists', 'recursion'],
    tags: ['Linked List', 'Two Pointers'],
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.\n\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn *the head of the merged linked list*.`,
    examples: [
      { input: '[1, 2, 4], [1, 3, 4]', output: '[1, 1, 2, 3, 4, 4]', explanation: 'Merged sorted sequence.' },
      { input: '[], []', output: '[]', explanation: 'Both empty lists.' }
    ],
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both list1 and list2 are sorted in non-decreasing order.'],
    hints: [
      { order: 1, content: 'Use a dummy head node to simplify edge cases.' },
      { order: 2, content: 'Compare node values and append the smaller node to your merged chain.' }
    ],
    editorial: {
      approach: 'Dummy Head Node Merge',
      intuition: 'Iterate through both lists comparing heads until one is exhausted, then append the remainder.',
      complexity: { time: 'O(N + M)', space: 'O(1)' }
    },
    testCases: [
      { input: '[1, 2, 4], [1, 3, 4]', expected: '[1,1,2,3,4,4]', isHidden: false },
      { input: '[], []', expected: '[]', isHidden: false }
    ],
    starterCode: {
      javascript: 'function mergeTwoLists(list1, list2) {\n  // Write your code here\n}',
      python: 'def mergeTwoLists(list1, list2):\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n        return null;\n    }\n}'
    },
    rewards: { xp: 15, rating: 10 }
  },
  {
    problemNumber: 12,
    title: 'Top K Frequent Elements',
    slug: 'top-k-frequent-elements',
    difficulty: 'Medium',
    topicSlugs: ['heaps', 'hashing', 'arrays'],
    tags: ['Min Heap', 'Bucket Sort', 'Hash Table'],
    description: `Given an integer array \`nums\` and an integer \`k\`, return *the* \`k\` *most frequent elements*. You may return the answer in **any order**.`,
    examples: [
      { input: '[1, 1, 1, 2, 2, 3], 2', output: '[1, 2]', explanation: '1 occurs 3 times, 2 occurs 2 times.' },
      { input: '[1], 1', output: '[1]', explanation: '1 is the only element.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, the number of unique elements in the array].'],
    hints: [
      { order: 1, content: 'Count frequencies with a Hash Map.' },
      { order: 2, content: 'Use a Min Heap of size K or Bucket Sort array by frequency.' }
    ],
    editorial: {
      approach: 'Frequency Map + Min Heap / Bucket Sort',
      intuition: 'Bucket sort achieves O(N) by mapping count -> elements list.',
      complexity: { time: 'O(N)', space: 'O(N)' }
    },
    testCases: [
      { input: '[1, 1, 1, 2, 2, 3], 2', expected: '[1,2]', isHidden: false },
      { input: '[1], 1', expected: '[1]', isHidden: false }
    ],
    starterCode: {
      javascript: 'function topKFrequent(nums, k) {\n  // Write your code here\n}',
      python: 'def topKFrequent(nums: list[int], k: int) -> list[int]:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // Write your code here\n        return new int[]{};\n    }\n}'
    },
    rewards: { xp: 30, rating: 25 }
  },
  {
    problemNumber: 13,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    topicSlugs: ['two-pointers', 'stack', 'arrays'],
    tags: ['Two Pointers', 'Monotonic Stack'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      { input: '[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', output: '6', explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.' },
      { input: '[4, 2, 0, 3, 2, 5]', output: '9', explanation: '9 units of water trapped.' }
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    hints: [
      { order: 1, content: 'Water trapped at index i is determined by min(max_left, max_right) - height[i].' },
      { order: 2, content: 'Use Two Pointers (left, right) with maxLeft and maxRight tracked dynamically.' }
    ],
    editorial: {
      approach: 'Two Pointers',
      intuition: 'Advance the pointer on the side with the smaller max boundary, capturing water at the current bar.',
      complexity: { time: 'O(N)', space: 'O(1)' }
    },
    testCases: [
      { input: '[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', expected: '6', isHidden: false },
      { input: '[4, 2, 0, 3, 2, 5]', expected: '9', isHidden: false }
    ],
    starterCode: {
      javascript: 'function trap(height) {\n  // Write your code here\n}',
      python: 'def trap(height: list[int]) -> int:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public int trap(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}'
    },
    rewards: { xp: 60, rating: 50 }
  },
  {
    problemNumber: 14,
    title: 'Word Search',
    slug: 'word-search',
    difficulty: 'Medium',
    topicSlugs: ['backtracking', 'recursion'],
    tags: ['Backtracking', 'Matrix', 'DFS'],
    description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` *if* \`word\` *exists in the grid*.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    examples: [
      { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"', output: 'true', explanation: 'Word matches cells.' },
      { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"', output: 'false', explanation: 'No valid path.' }
    ],
    constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15'],
    hints: [
      { order: 1, content: 'Run DFS from every cell matching word[0].' },
      { order: 2, content: 'Mark visited cell temporarily (e.g. board[r][c] = "#") and revert upon returning (backtracking).' }
    ],
    editorial: {
      approach: 'Backtracking DFS',
      intuition: 'Search 4-directional paths, pruning early when characters mismatch.',
      complexity: { time: 'O(M * N * 3^L)', space: 'O(L)' }
    },
    testCases: [
      { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"', expected: 'true', isHidden: false },
      { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"', expected: 'false', isHidden: false }
    ],
    starterCode: {
      javascript: 'function exist(board, word) {\n  // Write your code here\n}',
      python: 'def exist(board: list[list[str]], word: str) -> bool:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        // Write your code here\n    }\n};',
      java: 'class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Write your code here\n        return false;\n    }\n}'
    },
    rewards: { xp: 35, rating: 25 }
  }
];
