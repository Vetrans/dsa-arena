import client from './client.js';

export const submissionsApi = {
  submitCode: (data) => client.post('/submissions', data),
  getSubmissionById: (id) => client.get(`/submissions/${id}`),
  getHistory: (params) => client.get('/submissions/history', { params })
};
