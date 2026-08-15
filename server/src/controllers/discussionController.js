import * as discussionService from '../services/discussionService.js';
import { success, paginated } from '../utils/apiResponse.js';

export const getDiscussions = async (req, res, next) => {
  try {
    const { problemId, page, limit, sort } = req.query;
    const result = await discussionService.getProblemDiscussions(problemId, { page, limit, sort });
    return paginated(res, result.comments, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { problemId, parentId, content, isSpoiler } = req.body;
    const comment = await discussionService.createComment({
      problemId,
      userId: req.user._id,
      parentId,
      content,
      isSpoiler
    });
    return success(res, comment, 'Comment posted', 201);
  } catch (error) {
    next(error);
  }
};

export const voteComment = async (req, res, next) => {
  try {
    const result = await discussionService.voteComment(req.params.id, req.user._id);
    return success(res, result);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const result = await discussionService.deleteComment(req.params.id, req.user._id, req.user.role);
    return success(res, result);
  } catch (error) {
    next(error);
  }
};
