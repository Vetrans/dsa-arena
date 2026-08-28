import client from "./client";

export const authApi = {
  register: (data) => client.post("/v1/auth/register", data),
  login: (data) => client.post("/v1/auth/login", data),
  logout: () => client.post("/v1/auth/logout"),
  getMe: () => client.get("/v1/auth/me"),
  refresh: () => client.post("/v1/auth/refresh"),
};

// Alias for consistency
export const authAPI = authApi;
