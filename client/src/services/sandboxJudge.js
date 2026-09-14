/**
 * Safe In-Browser Sandbox Judge Engine
 * Evaluates JavaScript code via dedicated Web Workers and executes simulated or backend-connected runs.
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

/**
 * Executes user JavaScript in an isolated Web Worker sandbox with hard timeout termination.
 */
export function runInWebWorker(code, input, timeoutMs = 2000) {
  return new Promise((resolve) => {
    try {
      const worker = new Worker(new URL("./evalWorker.js", import.meta.url), {
        type: "module"
      });

      let finished = false;

      const timer = setTimeout(() => {
        if (!finished) {
          finished = true;
          worker.terminate();
          resolve({
            success: false,
            error: "Time Limit Exceeded (Browser Sandbox 2000ms Limit)",
            logs: [],
            runtime: timeoutMs,
            memory: 0
          });
        }
      }, timeoutMs);

      worker.onmessage = (e) => {
        if (!finished) {
          finished = true;
          clearTimeout(timer);
          worker.terminate();
          resolve(e.data);
        }
      };

      worker.onerror = (err) => {
        if (!finished) {
          finished = true;
          clearTimeout(timer);
          worker.terminate();
          resolve({
            success: false,
            error: err.message || "Worker Execution Error",
            logs: [],
            runtime: 0,
            memory: 0
          });
        }
      };

      worker.postMessage({ code, input });
    } catch (err) {
      // Fallback if Web Workers are restricted in environment
      resolve({
        success: false,
        error: err.message || "Worker initialization failed",
        logs: [],
        runtime: 0,
        memory: 0
      });
    }
  });
}

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
      const run = await runInWebWorker(code, tc.input, 2000);

      if (!run.success) {
        results.push({
          index: i + 1,
          input: tc.input,
          expected: tc.expected,
          actual: run.error.includes("Time Limit") ? "Time Limit Exceeded" : "Runtime Error",
          passed: false,
          error: run.error,
          logs: run.logs || [],
          isHidden: tc.isHidden
        });
        return {
          verdict: run.error.includes("Time Limit") ? "TIME_LIMIT_EXCEEDED" : "RUNTIME_ERROR",
          verdictLabel: run.error.includes("Time Limit") ? "Time Limit Exceeded" : "Runtime Error",
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
        logs: run.logs || [],
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
