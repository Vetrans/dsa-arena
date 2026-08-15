import * as dailyChallengeService from '../services/dailyChallengeService.js';
import { success } from '../utils/apiResponse.js';

export const getDailyChallenge = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const challenge = await dailyChallengeService.getTodayDailyChallenge(userId);
    return success(res, challenge);
  } catch (error) {
    next(error);
  }
};
