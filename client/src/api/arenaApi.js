import client from './client.js';

export const leaderboardApi = {
  getLeaderboard: (params) => client.get('/leaderboards', { params }),
  getRankingsMovement: () => client.get('/leaderboards/movement')
};

export const achievementsApi = {
  getAchievements: () => client.get('/achievements')
};

export const streaksApi = {
  getCurrentStreak: () => client.get('/streaks/current')
};

export const discussionsApi = {
  getDiscussions: (params) => client.get('/discussions', { params }),
  createComment: (data) => client.post('/discussions', data),
  voteComment: (id) => client.post(`/discussions/${id}/vote`),
  deleteComment: (id) => client.delete(`/discussions/${id}`)
};

export const feedbackApi = {
  submitFeedback: (data) => client.post('/feedback', data)
};

export const recommendationsApi = {
  getRecommendations: (limit = 5) => client.get('/recommendations', { params: { limit } })
};

export const dailyChallengeApi = {
  getTodayChallenge: () => client.get('/daily-challenge')
};

export const notificationsApi = {
  getNotifications: (params) => client.get('/notifications', { params }),
  getUnreadCount: () => client.get('/notifications/count'),
  markAsRead: (id) => client.put(`/notifications/${id}/read`),
  markAllAsRead: () => client.put('/notifications/read-all')
};

export const analyticsApi = {
  getPersonalAnalytics: () => client.get('/analytics/personal')
};

export const adminApi = {
  getDashboardStats: () => client.get('/admin/dashboard'),
  getUsers: (params) => client.get('/admin/users', { params }),
  updateUserRole: (id, role) => client.put(`/admin/users/${id}/role`, { role }),
  toggleUserSuspend: (id, data) => client.put(`/admin/users/${id}/suspend`, data),
  getFeedback: (params) => client.get('/admin/feedback', { params }),
  updateFeedbackStatus: (id, data) => client.put(`/admin/feedback/${id}`, data),
  createProblem: (data) => client.post('/problems', data),
  updateProblem: (id, data) => client.put(`/problems/${id}`, data),
  deleteProblem: (id) => client.delete(`/problems/${id}`)
};
