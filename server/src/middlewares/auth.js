import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { error } from '../utils/apiResponse.js';
import { env } from '../config/env.js';
const readAccessToken = (req) => req.cookies?.access_token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
export const authenticate = async (req, res, next) => {
  const token = readAccessToken(req);
  if (!token) return error(res, 'Authentication is required', 401, 'AUTH_REQUIRED');
  try { const decoded = jwt.verify(token, env.JWT_SECRET); req.user = await User.findById(decoded.sub); if (!req.user) return error(res, 'User not found', 404, 'NOT_FOUND'); if (req.user.status !== 'ACTIVE') return error(res, 'User account is not active', 403, 'ACCOUNT_BANNED'); return next(); } catch (err) { return next(err); }
};
export const optionalAuth = async (req, res, next) => { const token = readAccessToken(req); req.user = null; if (token) { try { req.user = await User.findById(jwt.verify(token, env.JWT_SECRET).sub); } catch {} } next(); };
export const requireRole = (...roles) => (req, res, next) => (!req.user || !roles.includes(req.user.role) ? error(res, 'You do not have permission to perform this action', 403, 'FORBIDDEN') : next());
