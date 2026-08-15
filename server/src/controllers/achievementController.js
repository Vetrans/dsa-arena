import * as achievementService from '../services/achievementService.js';
import { success } from '../utils/apiResponse.js';

export const getAchievements = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const achievements = await achievementService.getAllAchievements(userId);
    return success(res, achievements);
  } catch (error) {
    next(error);
  }
};
