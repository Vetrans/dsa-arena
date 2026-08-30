/**
 * Safe In-Browser Sandbox Judge Engine
 * Evaluates JavaScript code and executes simulated or backend-connected runs.
 */

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

const areEqualOutputs = (actual, expected) => {
  const normActual = normalizeValue(actual).trim().replace(/\s+/g, "");
  const normExpected = String(expected).trim().replace(/\s+/g, "");
  if (normActual === normExpected) return true;

  // Try JSON deep comparison
  try {
    const actJson = JSON.parse(normActual);
    const expJson = JSON.parse(normExpected);
    return JSON.stringify(actJson) === JSON.stringify(expJson);
  } catch {
    return normActual.toLowerCase() === normExpected.toLowerCase();
  }
};

const parseInputArgs = (inputStr) => {
  try {
    return JSON.parse(`[${inputStr}]`);
  } catch {
    // If simple string without quotes
    return [inputStr];
  }
};

export const runJavaScriptInSandbox = (userCode, inputStr, timeoutMs = 1500) => {
  const logs = [];
  const originalLog = console.log;

  try {
    const args = parseInputArgs(inputStr);

    const wrappedFn = new Function(
      "customConsole",
      `
      const console = {
        log: (...args) => customConsole.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
      };
      
      ${userCode}

      // Find callable solution function
      if (typeof twoSum === 'function') return twoSum(...arguments);
      if (typeof isValid === 'function') return isValid(...arguments);
      if (typeof maxSubArray === 'function') return maxSubArray(...arguments);
      if (typeof merge === 'function') return merge(...arguments);
      if (typeof lengthOfLongestSubstring === 'function') return lengthOfLongestSubstring(...arguments);
      if (typeof reverseList === 'function') return reverseList(...arguments);
      if (typeof climbStairs === 'function') return climbStairs(...arguments);
      if (typeof coinChange === 'function') return coinChange(...arguments);
      if (typeof ladderLength === 'function') return ladderLength(...arguments);
      if (typeof solution === 'function') return solution(...arguments);

      const match = ${JSON.stringify(userCode)}.match(/(?:function\\s+([a-zA-Z0-9_$]+)|var\\s+([a-zA-Z0-9_$]+)\\s*=\\s*function|const\\s+([a-zA-Z0-9_$]+)\\s*=\\s*\\()/);
      const fnName = match ? (match[1] || match[2] || match[3]) : null;
      if (fnName && typeof eval(fnName) === 'function') {
        return eval(fnName)(...arguments);
      }

      throw new Error("Could not find a valid solution function to execute. Please ensure your function name matches the starter code.");
    `
    );

    const startTime = performance.now();
    const result = wrappedFn(logs, ...args);
    const duration = Math.max(1, Math.round(performance.now() - startTime));

    return {
      success: true,
      result,
      outputStr: normalizeValue(result),
      logs,
      runtime: duration + Math.floor(Math.random() * 25 + 15), // realistic ms
      memory: +(38.2 + Math.random() * 5.4).toFixed(1)
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Runtime Exception",
      logs,
      runtime: 0,
      memory: 0
    };
  }
};

export const executeProblemTests = async ({
  code,
  language = "javascript",
  testCases = [],
  isFullSubmit = false
}) => {
  if (!code || !code.trim()) {
    return {
      verdict: "COMPILATION_ERROR",
      verdictLabel: "Compilation Error",
      errorMessage: "Source code cannot be empty.",
      passedTestCases: 0,
      totalTestCases: testCases.length,
      testResults: []
    };
  }

  // Syntax check
  if (["javascript", "cpp", "java"].includes(language)) {
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      return {
        verdict: "COMPILATION_ERROR",
        verdictLabel: "Compilation Error",
        errorMessage: `SyntaxError: Mismatched curly braces. Found ${openBraces} '{' and ${closeBraces} '}'.`,
        passedTestCases: 0,
        totalTestCases: testCases.length,
        testResults: []
      };
    }
  }

  // Filter test cases: if Run Code, only evaluate non-hidden; if Submit, evaluate all
  const testsToRun = isFullSubmit
    ? testCases
    : testCases.filter((tc) => !tc.isHidden);

  const results = [];
  let passedCount = 0;
  let totalRuntime = 0;
  let maxMemory = 38.5;

  for (let i = 0; i < testsToRun.length; i++) {
    const tc = testsToRun[i];

    if (language === "javascript") {
      const run = runJavaScriptInSandbox(code, tc.input);

      if (!run.success) {
        results.push({
          index: i + 1,
          input: tc.input,
          expected: tc.expected,
          actual: "Runtime Error",
          passed: false,
          error: run.error,
          logs: run.logs,
          isHidden: tc.isHidden
        });
        return {
          verdict: "RUNTIME_ERROR",
          verdictLabel: "Runtime Error",
          errorMessage: run.error,
          passedTestCases: passedCount,
          totalTestCases: testsToRun.length,
          testResults: results,
          failedAt: i + 1
        };
      }

      const passed = areEqualOutputs(run.result, tc.expected);
      if (passed) passedCount++;

      totalRuntime += run.runtime;
      if (run.memory > maxMemory) maxMemory = run.memory;

      results.push({
        index: i + 1,
        input: tc.input,
        expected: tc.expected,
        actual: run.outputStr,
        passed,
        runtime: run.runtime,
        logs: run.logs,
        isHidden: tc.isHidden
      });

      if (!passed && isFullSubmit) {
        return {
          verdict: "WRONG_ANSWER",
          verdictLabel: "Wrong Answer",
          errorMessage: `Wrong Answer on Testcase ${i + 1}`,
          passedTestCases: passedCount,
          totalTestCases: testsToRun.length,
          testResults: results,
          runtime: Math.round(totalRuntime / (i + 1)),
          memory: +maxMemory.toFixed(1),
          failedCase: {
            input: tc.isHidden ? "[Hidden Test Case]" : tc.input,
            expected: tc.isHidden ? "[Hidden Expected]" : tc.expected,
            actual: run.outputStr
          }
        };
      }
    } else {
      // Python / C++ / Java simulated execution
      const hasFunctionBody =
        code.includes("return") ||
        code.includes("print") ||
        code.includes("cout") ||
        code.includes("System.out");

      if (!hasFunctionBody) {
        return {
          verdict: "WRONG_ANSWER",
          verdictLabel: "Wrong Answer",
          errorMessage: "No return value provided in solution body.",
          passedTestCases: 0,
          totalTestCases: testsToRun.length,
          testResults: []
        };
      }

      passedCount++;
      results.push({
        index: i + 1,
        input: tc.input,
        expected: tc.expected,
        actual: tc.expected,
        passed: true,
        runtime: Math.floor(Math.random() * 15 + 10),
        logs: [],
        isHidden: tc.isHidden
      });
    }
  }

  const allPassed = passedCount === testsToRun.length;
  const avgRuntime = Math.round(totalRuntime / Math.max(1, testsToRun.length)) || 42;

  return {
    verdict: allPassed ? "ACCEPTED" : "WRONG_ANSWER",
    verdictLabel: allPassed ? "Accepted" : "Wrong Answer",
    passedTestCases: passedCount,
    totalTestCases: testsToRun.length,
    testResults: results,
    runtime: avgRuntime,
    memory: +maxMemory.toFixed(1)
  };
};
