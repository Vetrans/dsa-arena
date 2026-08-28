import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { Session, User } from '../models/index.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
const expiry = () => new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86400000);
export const issueAccessToken = (userId) => jwt.sign({ sub: userId.toString() }, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });

async function issueSession(user, metadata) {
  const refreshToken = crypto.randomBytes(48).toString('base64url');
  await Session.create({ userId: user._id, tokenHash: hashToken(refreshToken), expiresAt: expiry(), ...metadata });
  return { user: user.toPublicProfile(), accessToken: issueAccessToken(user._id), refreshToken };
}

export const register = async ({ username, email, password, displayName }, metadata) => {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.trim();
  const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { username: normalizedUsername }] }).lean();
  if (existingUser) throw new AppError('CONFLICT', existingUser.email === normalizedEmail ? 'Email already in use' : 'Username already taken', 409);
  const user = await User.create({ username: normalizedUsername, email: normalizedEmail, passwordHash: password, displayName: displayName.trim() });
  return issueSession(user, metadata);
};

export const login = async ({ email, password }, metadata) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!user || user.status !== 'ACTIVE' || !(await user.comparePassword(password))) throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  user.lastActiveAt = new Date();
  await user.save({ validateBeforeSave: false });
  return issueSession(user, metadata);
};

export const rotateSession = async (token, metadata) => {
  if (!token) throw new AppError('AUTH_REQUIRED', 'Refresh token is required', 401);
  const session = await Session.findOne({ tokenHash: hashToken(token), revokedAt: null }).populate('userId');
  if (!session || session.expiresAt <= new Date() || session.userId.status !== 'ACTIVE') throw new AppError('AUTH_REQUIRED', 'Session is invalid or expired', 401);
  session.revokedAt = new Date();
  await session.save();
  return issueSession(session.userId, metadata);
};

export const revokeSession = async (token) => Session.updateOne({ tokenHash: hashToken(token), revokedAt: null }, { $set: { revokedAt: new Date() } });
export const revokeAllSessions = async (userId) => Session.updateMany({ userId, revokedAt: null }, { $set: { revokedAt: new Date() } });
