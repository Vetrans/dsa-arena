import * as adminService from '../services/adminService.js';
import * as problemService from '../services/problemService.js';
import { success, paginated } from '../utils/apiResponse.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const data = await adminService.getAdminDashboardStats();
    return success(res, data);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { page, limit, search, role, status } = req.query;
    const result = await adminService.getAdminUsers({ page, limit, search, role, status });
    return paginated(res, result.users, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await adminService.updateUserRole(req.params.id, req.body.role, req.user._id);
    return success(res, user, 'User role updated');
  } catch (error) {
    next(error);
  }
};

export const toggleUserSuspend = async (req, res, next) => {
  try {
    const user = await adminService.toggleUserSuspend(
      req.params.id,
      req.body.suspend,
      req.body.reason,
      req.user._id
    );
    return success(res, user, req.body.suspend ? 'User suspended' : 'User unsuspended');
  } catch (error) {
    next(error);
  }
};

export const getFeedback = async (req, res, next) => {
  try {
    const { page, limit, status, problemId } = req.query;
    const result = await adminService.getAdminFeedback({ page, limit, status, problemId });
    return paginated(res, result.feedbackList, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
};

export const updateFeedbackStatus = async (req, res, next) => {
  try {
    const feedback = await adminService.updateFeedbackStatus(
      req.params.id,
      req.body.status,
      req.body.adminNotes,
      req.user._id
    );
    return success(res, feedback, 'Feedback status updated');
  } catch (error) {
    next(error);
  }
};

export const grantUserPoints = async (req, res, next) => {
  try {
    const user = await adminService.grantUserPoints(
      req.params.id,
      {
        xp: Number(req.body.xp || 0),
        rating: Number(req.body.rating || 0),
        reason: req.body.reason || ''
      },
      req.user._id
    );
    return success(res, user, 'Points and rating successfully granted');
  } catch (error) {
    next(error);
  }
};

export const warnUser = async (req, res, next) => {
  try {
    const user = await adminService.warnUser(
      req.params.id,
      { reason: req.body.reason || 'Official arena warning' },
      req.user._id
    );
    return success(res, user, 'Warning issued to user');
  } catch (error) {
    next(error);
  }
};

export const clearWarnings = async (req, res, next) => {
  try {
    const user = await adminService.clearWarnings(req.params.id, req.user._id);
    return success(res, user, 'Warnings cleared; reputation restored to Clean');
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await adminService.deleteUser(req.params.id, req.user._id);
    return success(res, user, 'User successfully removed');
  } catch (error) {
    next(error);
  }
};
