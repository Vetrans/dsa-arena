import client from './client.js';

export const problemsApi = {
  getProblems: (params) => client.get('/problems', { params }),
  getProblemBySlug: (slug) => client.get(`/problems/${slug}`),
  getProblemHints: (slug, level = 1) => client.get(`/problems/${slug}/hints`, { params: { level } }),
  getProblemEditorial: (slug) => client.get(`/problems/${slug}/editorial`),
  getProblemFeedbackStats: (id) => client.get(`/problems/${id}/feedback-stats`),
  getTopics: () => client.get('/topics')
};
