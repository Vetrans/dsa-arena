import * as problemService from '../services/problemService.js';
import * as feedbackService from '../services/feedbackService.js';
import { success, paginated } from '../utils/apiResponse.js';

export const getProblems = async (req, res, next) => {
  try {
    const { page, limit, difficulty, topic, status, search, sort, order, userStatus } = req.query;
    const userId = req.user ? req.user._id : null;

    const result = await problemService.getProblems({
      page,
      limit,
      difficulty,
      topic,
      status,
      search,
      sort,
      order,
      userStatus,
      userId
    });

    return paginated(res, result.problems, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
};

export const getProblemBySlug = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const problem = await problemService.getProblemBySlug(req.params.slug, userId);
    return success(res, problem);
  } catch (error) {
    next(error);
  }
};

export const getProblemHints = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const hint = await problemService.getProblemHints(req.params.slug, userId, req.query.level || 1);
    return success(res, hint);
  } catch (error) {
    next(error);
  }
};

export const getProblemEditorial = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const editorial = await problemService.getProblemEditorial(req.params.slug, userId);
    return success(res, editorial);
  } catch (error) {
    next(error);
  }
};

export const getProblemFeedbackStats = async (req, res, next) => {
  try {
    const stats = await feedbackService.getProblemFeedbackStats(req.params.id);
    return success(res, stats);
  } catch (error) {
    next(error);
  }
};

export const createProblem = async (req, res, next) => {
  try {
    const problem = await problemService.createProblem(req.body, req.user._id);
    return success(res, problem, 'Problem created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req, res, next) => {
  try {
    const problem = await problemService.updateProblem(req.params.id, req.body);
    return success(res, problem, 'Problem updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req, res, next) => {
  try {
    await problemService.deleteProblem(req.params.id);
    return success(res, null, 'Problem deleted successfully');
  } catch (error) {
    next(error);
  }
};
