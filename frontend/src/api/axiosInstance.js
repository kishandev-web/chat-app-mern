import axios from "axios";
import { getToken } from "./tokenManager";

/**
 * Centralized Axios Instance
 *
 * Hinglish explanation:
 * Ye ek common axios instance hai jisme base URL set hai (http://localhost:5001/api).
 * Request Interceptor har request mein tokenManager se JWT token uthakar
 * 'Authorization: Bearer <token>' header automatically laga deta hai.
 * Response Interceptor responses ko directly unpack karta hai aur errors ko
 * readable format mein throw karta hai.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT token if available
// Reads from tokenManager (in-memory) which is set by authSlice on login.
// Falls back to localStorage for page-refresh scenarios.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract data and handle errors
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    // Auto logout if 401 Unauthorized (token expired or invalid).
    // Guard auth routes — 401 there means token is missing/invalid mid-flow,
    // NOT that the user's session has truly expired.
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthRoute =
        url.includes("/auth/verify-token") ||
        url.includes("/auth/complete-profile");
      if (!isAuthRoute) {
        localStorage.removeItem("chat_token");
        localStorage.removeItem("chat_user");
      }
    }

    return Promise.reject(new Error(customMessage));
  }
);

export default axiosInstance;
