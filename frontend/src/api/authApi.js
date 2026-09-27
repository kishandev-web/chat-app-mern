import axiosInstance from "./axiosInstance";

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Firebase ID Token verify karke Backend JWT + User fetch karo
   * @param {string} firebaseToken
   */
  verifyFirebaseToken: async (firebaseToken) => {
    return await axiosInstance.post("/auth/verify-token", {
      token: firebaseToken,
    });
  },

  /**
   * Complete User Profile (name, userName, about, avatar image)
   * @param {FormData} formData
   */
  completeProfile: async (formData) => {
    // Use postForm so axios auto-sets multipart/form-data boundary
    // WITHOUT overriding the Authorization header added by the request interceptor
    return await axiosInstance.postForm("/auth/complete-profile", formData);
  },
};

export default authApi;
