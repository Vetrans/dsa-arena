import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we are not already on login/register
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.match(/^\/(login|register)/) &&
        !error.config?.url?.includes("/auth/refresh")
      ) {
        window.location.href = "/login";
      }
    }

    // Format error message
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
