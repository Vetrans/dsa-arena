/**
 * In-Browser Web Worker for Sandboxed JavaScript Evaluation.
 * Executes in an isolated thread without DOM access and without blocking UI.
 */

self.onmessage = function (e) {
  const { code, input } = e.data;
  const logs = [];

  const normalizeValue = (val) => {
    if (val === undefined) return "undefined";
    if (val === null) return "null";
    if (typeof val === "object") {
      try {
        return JSON.stringify(val);
      } catch {
        return String(val);
      }
    }
    return String(val);
  };

  const parseInputArgs = (inputStr) => {
    if (inputStr === undefined || inputStr === null) return [];
    const str = String(inputStr).trim();
    if (!str) return [];

    try {
      return JSON.parse(`[${str}]`);
    } catch {
      /* continue */
      void 0;
    }

    try {
      const cleaned = str.replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*/g, '');
      return JSON.parse(`[${cleaned}]`);
    } catch {
      /* continue */
      void 0;
    }

    try {
      const withQuotes = str.replace(/'/g, '"').replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*/g, '');
      return JSON.parse(`[${withQuotes}]`);
    } catch {
      /* continue */
      void 0;
    }

    try {
      const fn = new Function(`return [${str}];`);
      return fn();
    } catch {
      /* continue */
      void 0;
    }

    return [str];
  };

  try {
    const args = parseInputArgs(input);

    const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    const regex = /(?:function\s+([a-zA-Z0-9_$]+)|(?:var|let|const)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:function|\([^)]*\)\s*=>|[a-zA-Z0-9_$]+\s*=>)|class\s+([a-zA-Z0-9_$]+))/g;
    const candidateNames = [];
    let m;
    while ((m = regex.exec(cleanCode)) !== null) {
      const name = m[1] || m[2] || m[3];
      if (name && !candidateNames.includes(name) && name !== 'ListNode' && name !== 'TreeNode') {
        candidateNames.push(name);
      }
    }

    const wrappedFn = new Function(
      "customConsole",
      `
      const console = {
        log: (...args) => customConsole.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
      };

      function ListNode(val, next) {
        this.val = (val===undefined ? 0 : val);
        this.next = (next===undefined ? null : next);
      }

      function TreeNode(val, left, right) {
        this.val = (val===undefined ? 0 : val);
        this.left = (left===undefined ? null : left);
        this.right = (right===undefined ? null : right);
      }

      function serializeResult(val) {
        if (val && typeof val === 'object' && val.val !== undefined && 'next' in val) {
          const arr = [];
          let curr = val;
          while (curr) {
            arr.push(curr.val);
            curr = curr.next;
          }
          return arr;
        }
        return val;
      }
      
      ${code}

      // 1. Check for class Solution instance methods
      if (typeof Solution === 'function') {
        try {
          const inst = new Solution();
          const proto = Object.getPrototypeOf(inst);
          const methods = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor' && typeof inst[m] === 'function');
          if (methods.length > 0) {
            return serializeResult(inst[methods[0]](...arguments));
          }
        } catch(e) {}
      }

      // 2. Discovered candidate function names
      const candidates = ${JSON.stringify(candidateNames)};
      for (const name of candidates) {
        try {
          const fn = eval(name);
          if (typeof fn === 'function') {
            return serializeResult(fn(...arguments));
          }
        } catch(e) {}
      }

      // 3. Fallback generic algorithm names
      const fallbackNames = ['solution', 'solve', 'twoSum', 'isValid', 'climbStairs', 'coinChange', 'reverseList', 'maxSubArray', 'lengthOfLongestSubstring', 'trap', 'exist'];
      for (const fn of fallbackNames) {
        try {
          if (typeof eval(fn) === 'function') return serializeResult(eval(fn)(...arguments));
        } catch(e) {}
      }

      throw new Error("Could not find a valid solution function to execute. Please ensure your solution function is defined.");
    `
    );

    const startTime = performance.now();
    const result = wrappedFn(logs, ...args);
    const duration = Math.max(1, Math.round(performance.now() - startTime));

    self.postMessage({
      success: true,
      result,
      outputStr: normalizeValue(result),
      logs,
      runtime: duration,
      memory: 38.5
    });
  } catch (err) {
    self.postMessage({
      success: false,
      error: err.message || "Runtime Exception",
      logs,
      runtime: 0,
      memory: 0
    });
  }
};
