import axiosInstance from "./axiosInstance";

/**
 * Chat API Service
 */
export const chatApi = {
  /**
   * Fetch all chats for logged-in user
   */
  getChats: async () => {
    return await axiosInstance.get("/chats");
  },

  /**
   * Create or retrieve existing direct chat with receiver
   * @param {string} receiverId
   */
  createDirectChat: async (receiverId) => {
    return await axiosInstance.post("/chats", { receiverId });
  },

  /**
   * Create a new group chat
   * @param {FormData} formData
   */
  createGroupChat: async (formData) => {
    return await axiosInstance.post("/chats/group", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Fetch details of a single chat
   * @param {string} chatId
   */
  getChatDetail: async (chatId) => {
    return await axiosInstance.get(`/chats/${chatId}`);
  },
};

export default chatApi;
