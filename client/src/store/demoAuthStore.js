import { create } from 'zustand';
const saved = JSON.parse(sessionStorage.getItem('nyc-demo-user') || 'null');
export const useDemoAuth = create((set) => ({ user: saved, login: (email) => { const user = { username: email.split('@')[0] || 'arena_user', email }; sessionStorage.setItem('nyc-demo-user', JSON.stringify(user)); set({ user }); }, register: (username, email) => { const user = { username, email }; sessionStorage.setItem('nyc-demo-user', JSON.stringify(user)); set({ user }); }, logout: () => { sessionStorage.removeItem('nyc-demo-user'); set({ user: null }); } }));
