import * as submissionService from '../services/submissionService.js';
import { evaluateSubmission } from '../services/judgeService.js';
import { Problem } from '../models/index.js';
import { success, paginated } from '../utils/apiResponse.js';
import { createDuplicateClient, redisAvailable } from '../config/redis.js';

export const runCode = async (req, res, next) => {
  try {
    const { problemId, language = 'javascript', code, testCases, customInput } = req.body;
    let testsToRun = testCases;
    if ((!testsToRun || testsToRun.length === 0) && problemId) {
      const problem = await Problem.findById(problemId);
      testsToRun = problem ? (problem.testCases || []).filter(tc => !tc.isHidden) : [];
    }
    if (customInput) {
      testsToRun = [{ input: customInput, expected: 'N/A', isHidden: false }];
    }

    const evalResult = await evaluateSubmission({
      code,
      language,
      testCases: testsToRun || [],
      timeLimit: 3000,
      memoryLimit: 256
    });

    return success(res, evalResult);
  } catch (error) {
    next(error);
  }
};

export const submitSolution = async (req, res, next) => {
  try {
    const { problemId, language, code } = req.body;
    const userId = req.user._id;

    const result = await submissionService.submitSolutionAsync({
      userId,
      problemId,
      language,
      code
    });

    return res.status(202).json({
      success: true,
      message: 'Submission queued for execution',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2.1. Server-Sent Events (SSE) for Real-Time Verdict Streaming
 */
export const getSubmissionEvents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submission = await submissionService.getSubmissionById(id, req.user._id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // If submission is already in a terminal state, send immediately and close
    if (['ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'SYSTEM_ERROR'].includes(submission.status)) {
      res.write(`data: ${JSON.stringify({ status: submission.status, submission })}\n\n`);
      return res.end();
    }

    // Send initial queued state
    res.write(`data: ${JSON.stringify({ status: submission.status, message: 'Execution in progress' })}\n\n`);

    // Subscribe to Redis Pub/Sub for completion event
    let subClient = null;
    if (redisAvailable) {
      subClient = await createDuplicateClient();
      if (subClient) {
        const channel = `${submissionService.SUBMISSION_COMPLETED_CHANNEL}:${id}`;
        await subClient.subscribe(channel, (message) => {
          try {
            const data = JSON.parse(message);
            res.write(`data: ${JSON.stringify({ status: data.status, result: data })}\n\n`);
            res.end();
          } catch {
            res.write(`data: ${message}\n\n`);
            res.end();
          }
        });
      }
    }

    // Polling fallback if Redis pub/sub unavailable or after timeout
    const interval = setInterval(async () => {
      try {
        const check = await submissionService.getSubmissionById(id, req.user._id);
        if (check && check.status !== 'QUEUED' && check.status !== 'RUNNING') {
          res.write(`data: ${JSON.stringify({ status: check.status, submission: check })}\n\n`);
          clearInterval(interval);
          res.end();
        }
      } catch {
        clearInterval(interval);
        res.end();
      }
    }, 500);

    req.on('close', async () => {
      clearInterval(interval);
      if (subClient) {
        try {
          await subClient.unsubscribe(`${submissionService.SUBMISSION_COMPLETED_CHANNEL}:${id}`);
          await subClient.quit();
        } catch {}
      }
    });
  } catch (error) {
    next(error);
  }
};


export const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await submissionService.getSubmissionById(req.params.id, req.user._id);
    return success(res, submission);
  } catch (error) {
    next(error);
  }
};

export const getSubmissions = async (req, res, next) => {
  try {
    const { page, limit, problemId, status } = req.query;
    const userId = req.user._id;

    const result = await submissionService.getSubmissions({
      userId,
      problemId,
      status,
      page,
      limit
    });

    return paginated(res, result.submissions, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
};
