import axiosInstance from "./axiosInstance";

/**
 * Message API Service
 */
export const messageApi = {
  /**
   * Fetch paginated messages for a chat
   * @param {string} chatId
   * @param {number} page
   * @param {number} limit
   */
  getMessages: async (chatId, page = 1, limit = 50) => {
    return await axiosInstance.get(`/messages/${chatId}?page=${page}&limit=${limit}`);
  },

  /**
   * Soft-delete a message (only sender can delete)
   * @param {string} messageId
   */
  deleteMessage: async (messageId) => {
    return await axiosInstance.delete(`/messages/${messageId}`);
  },
};

export default messageApi;
