import * as authService from '../services/authService.js';
import { success } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

const cookieOptions = (maxAge) => ({ httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge });
const metadata = (req) => ({ userAgent: req.get('user-agent') || '', ip: req.ip || '' });
const setAuthCookies = (res, data) => {
  res.cookie('access_token', data.accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie('refresh_token', data.refreshToken, cookieOptions(env.REFRESH_TOKEN_TTL_DAYS * 86400000));
};
const clearAuthCookies = (res) => {
  res.clearCookie('access_token', cookieOptions());
  res.clearCookie('refresh_token', cookieOptions());
};


export const register = async (req, res, next) => { try { const data = await authService.register(req.body, metadata(req)); setAuthCookies(res, data); return success(res, { user: data.user }, 'User registered successfully', 201); } catch (error) { next(error); } };
export const login = async (req, res, next) => { try { const data = await authService.login(req.body, metadata(req)); setAuthCookies(res, data); return success(res, { user: data.user }, 'Login successful'); } catch (error) { next(error); } };
export const refresh = async (req, res, next) => { try { const data = await authService.rotateSession(req.cookies.refresh_token, metadata(req)); setAuthCookies(res, data); return success(res, { user: data.user }, 'Session refreshed'); } catch (error) { clearAuthCookies(res); next(error); } };
export const getMe = async (req, res, next) => { try { return success(res, { user: req.user.toPublicProfile() }, 'Current user retrieved'); } catch (error) { next(error); } };
export const logout = async (req, res, next) => { try { if (req.cookies.refresh_token) await authService.revokeSession(req.cookies.refresh_token); clearAuthCookies(res); return success(res, null, 'Logged out successfully'); } catch (error) { next(error); } };
export const logoutAll = async (req, res, next) => { try { await authService.revokeAllSessions(req.user._id); clearAuthCookies(res); return success(res, null, 'All sessions logged out'); } catch (error) { next(error); } };
