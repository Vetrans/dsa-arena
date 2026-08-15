import * as authService from '../services/authService.js';
import { success } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    return success(res, data, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return success(res, data, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return success(res, { user: req.user.toPublicProfile() }, 'Current user retrieved');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Client should discard tokens; server handles refresh tokens in a real DB or Redis if desired
    return success(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};
