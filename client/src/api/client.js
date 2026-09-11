import axios from "axios";

export const client = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = client;

// Response interceptor
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = new Error(
      error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    );
    customError.status = error.response?.status;
    customError.code = error.response?.data?.code;
    customError.data = error.response?.data;

    return Promise.reject(customError);
  },
);

export default client;
