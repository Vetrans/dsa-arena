import * as analyticsService from '../services/analyticsService.js';
import { success } from '../utils/apiResponse.js';

export const getPersonalAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getUserAnalytics(req.user._id);
    return success(res, data);
  } catch (error) {
    next(error);
  }
};
