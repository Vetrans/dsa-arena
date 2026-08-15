import * as feedbackService from '../services/feedbackService.js';
import { success } from '../utils/apiResponse.js';

export const submitFeedback = async (req, res, next) => {
  try {
    const { problemId, difficultyPerception, qualityRating, category, comment } = req.body;
    const feedback = await feedbackService.submitFeedback({
      problemId,
      userId: req.user._id,
      difficultyPerception,
      qualityRating,
      category,
      comment
    });
    return success(res, feedback, 'Feedback submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};
