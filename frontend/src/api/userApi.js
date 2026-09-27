import axiosInstance from "./axiosInstance";

/**
 * User API Service
 */
export const userApi = {
  /**
   * Get logged-in user's profile details
   */
  getMe: async () => {
    return await axiosInstance.get("/users/me");
  },

  /**
   * Search users by name or username
   * @param {string} query
   */
  searchUsers: async (query) => {
    return await axiosInstance.get(`/users/search?q=${encodeURIComponent(query)}`);
  },
};

export default userApi;
