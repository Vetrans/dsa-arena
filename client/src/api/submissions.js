import client from "./client.js";

export const submissionsApi = {
  submitCode: (data) => client.post("/submissions", data),
  runCode: (data) => client.post("/submissions/run", data),
  getSubmissionById: (id) => client.get(`/submissions/${id}`),
  getHistory: (params) => client.get("/submissions/history", { params }),
  getEventsUrl: (id) => `/api/submissions/${id}/events`,
  pollSubmission: async (id, maxAttempts = 20, intervalMs = 600) => {
    for (let i = 0; i < maxAttempts; i++) {
      const res = await client.get(`/submissions/${id}`);
      const sub = res?.data || res;
      if (sub && !['QUEUED', 'RUNNING'].includes(sub.status)) {
        return sub;
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    const finalRes = await client.get(`/submissions/${id}`);
    return finalRes?.data || finalRes;
  }
};

