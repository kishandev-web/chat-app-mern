/**
 * Token Manager — Zero-dependency singleton
 *
 * Problem yeh tha:
 *   axiosInstance → store → authSlice → authApi → axiosInstance
 *   Ye circular dependency hai, isliye store undefined tha interceptor mein.
 *
 * Solution: Ye file koi bhi import nahi karti.
 *   - axiosInstance.js  →  tokenManager (getToken)
 *   - authSlice.js      →  tokenManager (setToken / clearToken)
 *   Koi circular dependency nahi!
 */

// In-memory token — always in sync with Redux state
let _token = localStorage.getItem("chat_token") || null;

/** Called by authSlice whenever the token is set or cleared */
export const setToken = (token) => {
  _token = token;
};

/** Called by axiosInstance request interceptor */
export const getToken = () => {
  // Primary: in-memory token (set by authSlice on login)
  // Fallback: localStorage (for page-refresh scenarios)
  return _token || localStorage.getItem("chat_token") || null;
};

/** Called by authSlice on logout / token clear */
export const clearToken = () => {
  _token = null;
};
