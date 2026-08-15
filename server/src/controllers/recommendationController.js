import * as recommendationService from '../services/recommendationService.js';
import { success } from '../utils/apiResponse.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const limit = req.query.limit || 5;
    const recommendations = await recommendationService.getPersonalizedRecommendations(req.user._id, limit);
    return success(res, recommendations);
  } catch (error) {
    next(error);
  }
};
