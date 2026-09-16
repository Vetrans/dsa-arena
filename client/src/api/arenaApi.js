import client from "./client.js";

export const leaderboardApi = {
  getLeaderboard: (params) => client.get("/leaderboards", { params }),
  getRankingsMovement: () => client.get("/leaderboards/movement"),
};

export const achievementsApi = {
  getAchievements: () => client.get("/achievements"),
};

export const streaksApi = {
  getCurrentStreak: () => client.get("/streaks/current"),
};

export const discussionsApi = {
  getDiscussions: (params) => client.get("/discussions", { params }),
  createComment: (data) => client.post("/discussions", data),
  voteComment: (id) => client.post(`/discussions/${id}/vote`),
  deleteComment: (id) => client.delete(`/discussions/${id}`),
};

export const feedbackApi = {
  submitFeedback: (data) => client.post("/feedback", data),
};

export const recommendationsApi = {
  getRecommendations: (limit = 5) =>
    client.get("/recommendations", { params: { limit } }),
};

export const dailyChallengeApi = {
  getTodayChallenge: () => client.get("/daily-challenge"),
};

export const notificationsApi = {
  getNotifications: (params) => client.get("/notifications", { params }),
  getUnreadCount: () => client.get("/notifications/count"),
  markAsRead: (id) => client.put(`/notifications/${id}/read`),
  markAllAsRead: () => client.put("/notifications/read-all"),
};

export const analyticsApi = {
  getPersonalAnalytics: () => client.get("/analytics/personal"),
};

export const contestApi = {
  getContests: (params) => client.get("/contests", { params }),
  getContestBySlug: (slug) => client.get(`/contests/${slug}`),
  createContest: (data) => client.post("/contests", data),
  registerContest: (slug) => client.post(`/contests/${slug}/register`),
  deleteContest: (slug) => client.delete(`/contests/${slug}`),
};

export const adminApi = {
  getDashboardStats: () => client.get("/admin/dashboard"),
  getUsers: (params) => client.get("/admin/users", { params }),
  updateUserRole: (id, role) => client.put(`/admin/users/${id}/role`, { role }),
  toggleUserSuspend: (id, data) =>
    client.put(`/admin/users/${id}/suspend`, data),
  grantPoints: (id, data) => client.post(`/admin/users/${id}/points`, data),
  warnUser: (id, data) => client.post(`/admin/users/${id}/warn`, data),
  clearWarnings: (id) => client.post(`/admin/users/${id}/clear-warnings`),
  deleteUser: (id) => client.delete(`/admin/users/${id}`),
  getFeedback: (params) => client.get("/admin/feedback", { params }),
  updateFeedbackStatus: (id, data) => client.put(`/admin/feedback/${id}`, data),
  createProblem: (data) => client.post("/problems", data),
  updateProblem: (id, data) => client.put(`/problems/${id}`, data),
  deleteProblem: (id) => client.delete(`/problems/${id}`),
};


