import { create } from 'zustand';
import { authAPI } from '../api/auth';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    set({ user: data.user, isAuthenticated: true });
    return data;
  },

  register: async (userData) => {
    const { data } = await authAPI.register(userData);
    set({ user: data.user, isAuthenticated: true });
    return data;
  },

  logout: async () => {
    try { await authAPI.logout(); } catch { /* Cookies may already be expired. */ }
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const { data } = await authAPI.getMe();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (updates) => {
    set((state) => ({ user: { ...state.user, ...updates } }));
  },
}));
