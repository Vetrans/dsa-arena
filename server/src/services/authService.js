import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const generateTokens = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
  });
  
  return { token, refreshToken };
};

export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

export const register = async ({ username, email, password, displayName }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const error = new Error(existingUser.email === email ? 'Email already in use' : 'Username already taken');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    username,
    email,
    passwordHash: password,
    displayName
  });

  const tokens = generateTokens(user._id);
  
  return {
    user: user.toPublicProfile(),
    ...tokens
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || user.status !== 'ACTIVE') {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  user.lastActiveAt = Date.now();
  await user.save({ validateBeforeSave: false });

  const tokens = generateTokens(user._id);
  
  return {
    user: user.toPublicProfile(),
    ...tokens
  };
};
