import { create } from 'zustand';

const getInitialTheme = () => {
  const saved = localStorage.getItem('nyc_arena_theme');
  if (saved) return saved;
  return 'dark';
};

export const useUIStore = create((set) => ({
  theme: getInitialTheme(),
  sidebarOpen: false,
  mobileNavOpen: false,

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('nyc_arena_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      return { theme: newTheme };
    });
  },

  setTheme: (theme) => {
    localStorage.setItem('nyc_arena_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
  closeMobileNav: () => set({ mobileNavOpen: false }),
}));
