import * as streakService from '../services/streakService.js';
import { success } from '../utils/apiResponse.js';

export const getStreak = async (req, res, next) => {
  try {
    const data = await streakService.getUserStreakInfo(req.user._id);
    return success(res, data);
  } catch (error) {
    next(error);
  }
};
