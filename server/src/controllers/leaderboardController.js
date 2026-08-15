import * as leaderboardService from '../services/leaderboardService.js';
import { success, paginated } from '../utils/apiResponse.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const { metric, period, page, limit } = req.query;
    const currentUserId = req.user ? req.user._id : null;

    const result = await leaderboardService.getLeaderboard({
      metric,
      period,
      page,
      limit,
      currentUserId
    });

    return res.status(200).json({
      success: true,
      data: result.rankings,
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
      currentUserRank: result.currentUserRank
    });
  } catch (error) {
    next(error);
  }
};

export const getRankingsMovement = async (req, res, next) => {
  try {
    const data = await leaderboardService.getRankingsMovement(req.user._id);
    return success(res, data);
  } catch (error) {
    next(error);
  }
};
