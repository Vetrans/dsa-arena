import * as userService from '../services/userService.js';
import { success, paginated } from '../utils/apiResponse.js';

export const getProfile = async (req, res, next) => {
  try {
    return success(res, { user: req.user.toPublicProfile() }, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    return success(res, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getUserByUsername = async (req, res, next) => {
  try {
    const user = await userService.getUserByUsername(req.params.username);
    return success(res, { user }, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { q, page, limit } = req.query;
    const data = await userService.searchUsers(q, page, limit);
    return paginated(res, data.users, data.total, data.page, data.limit, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};
