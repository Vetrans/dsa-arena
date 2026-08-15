import { create } from 'zustand';
import { authAPI } from '../api/auth';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('nyc_arena_token') || null,
  isAuthenticated: !!localStorage.getItem('nyc_arena_token'),
  isLoading: true,

  login: async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('nyc_arena_token', data.token);
    set({ user: data.user, token: data.token, isAuthenticated: true });
    return data;
  },

  register: async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('nyc_arena_token', data.token);
    set({ user: data.user, token: data.token, isAuthenticated: true });
    return data;
  },

  logout: () => {
    localStorage.removeItem('nyc_arena_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('nyc_arena_token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('nyc_arena_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (updates) => {
    set((state) => ({ user: { ...state.user, ...updates } }));
  },
}));
