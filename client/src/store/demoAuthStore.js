import { create } from "zustand";
const saved = JSON.parse(sessionStorage.getItem("nyc-demo-user") || "null");
export const useDemoAuth = create((set) => ({
  user: saved,
  login: (email, role = "user") => {
    const isSpecialAdmin = email.toLowerCase().includes("admin");
    const user = {
      username: email.split("@")[0] || "arena_user",
      email,
      role: isSpecialAdmin ? "admin" : role
    };
    sessionStorage.setItem("nyc-demo-user", JSON.stringify(user));
    set({ user });
  },
  register: (username, email, role = "user") => {
    const isSpecialAdmin = username.toLowerCase().includes("admin") || email.toLowerCase().includes("admin");
    const user = { username, email, role: isSpecialAdmin ? "admin" : role };
    sessionStorage.setItem("nyc-demo-user", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    sessionStorage.removeItem("nyc-demo-user");
    set({ user: null });
  },
}));
