import * as submissionService from '../services/submissionService.js';
import { success, paginated } from '../utils/apiResponse.js';

export const submitSolution = async (req, res, next) => {
  try {
    const { problemId, language, code } = req.body;
    const userId = req.user._id;

    const result = await submissionService.submitSolution({
      userId,
      problemId,
      language,
      code
    });

    return success(res, result, 'Submission evaluated successfully', 201);
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
