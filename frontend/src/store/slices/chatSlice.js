import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatApi from "../../api/chatApi";
import userApi from "../../api/userApi";

export const fetchChatsThunk = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.getChats();
      return response.data; // array of populated chats
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrGetChatThunk = createAsyncThunk(
  "chat/createOrGetChat",
  async (receiverId, { rejectWithValue }) => {
    try {
      const response = await chatApi.createDirectChat(receiverId);
      // Fetch full chat details to get populated participants
      const detailResponse = await chatApi.getChatDetail(response.data._id);
      return detailResponse.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createGroupThunk = createAsyncThunk(
  "chat/createGroup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await chatApi.createGroupChat(formData);
      const detailResponse = await chatApi.getChatDetail(response.data._id);
      return detailResponse.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchUsersThunk = createAsyncThunk(
  "chat/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      if (!query.trim()) return [];
      const response = await userApi.searchUsers(query);
      return response.data; // array of users
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChat: null,
    onlineUsers: [], // Array of user IDs
    typingUsers: {}, // { [chatId]: [userId, ...] }
    searchResults: [],
    loading: false,
    searchLoading: false,
    error: null,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    clearActiveChat: (state) => {
      state.activeChat = null;
    },
    updateLastMessage: (state, action) => {
      const message = action.payload;
      const chatId = message.chatId;

      const chatIndex = state.chats.findIndex((c) => c._id === chatId);
      if (chatIndex !== -1) {
        const targetChat = {
          ...state.chats[chatIndex],
          lastMessage: message,
          updatedAt: message.createdAt || new Date().toISOString(),
        };
        // Move chat to top of list like real WhatsApp
        state.chats.splice(chatIndex, 1);
        state.chats.unshift(targetChat);

        if (state.activeChat?._id === chatId) {
          state.activeChat = targetChat;
        }
      }
    },
    setUserOnline: (state, action) => {
      const { userId } = action.payload;
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
      // Update participants in chat list
      state.chats.forEach((c) => {
        c.participants?.forEach((p) => {
          if (p._id === userId) p.isOnline = true;
        });
      });
      if (state.activeChat) {
        state.activeChat.participants?.forEach((p) => {
          if (p._id === userId) p.isOnline = true;
        });
      }
    },
    setUserOffline: (state, action) => {
      const { userId, lastSeen } = action.payload;
      state.onlineUsers = state.onlineUsers.filter((id) => id !== userId);
      state.chats.forEach((c) => {
        c.participants?.forEach((p) => {
          if (p._id === userId) {
            p.isOnline = false;
            p.lastSeen = lastSeen;
          }
        });
      });
      if (state.activeChat) {
        state.activeChat.participants?.forEach((p) => {
          if (p._id === userId) {
            p.isOnline = false;
            p.lastSeen = lastSeen;
          }
        });
      }
    },
    setTyping: (state, action) => {
      const { chatId, userId } = action.payload;
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = [];
      }
      if (!state.typingUsers[chatId].includes(userId)) {
        state.typingUsers[chatId].push(userId);
      }
    },
    clearTyping: (state, action) => {
      const { chatId, userId } = action.payload;
      if (state.typingUsers[chatId]) {
        state.typingUsers[chatId] = state.typingUsers[chatId].filter(
          (id) => id !== userId
        );
      }
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    resetChatState: (state) => {
      state.chats = [];
      state.activeChat = null;
      state.onlineUsers = [];
      state.typingUsers = {};
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // ─── fetchChatsThunk ───
    builder
      .addCase(fetchChatsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ─── createOrGetChatThunk ───
    builder
      .addCase(createOrGetChatThunk.fulfilled, (state, action) => {
        const newChat = action.payload;
        const exists = state.chats.some((c) => c._id === newChat._id);
        if (!exists) {
          state.chats.unshift(newChat);
        }
        state.activeChat = newChat;
      });

    // ─── createGroupThunk ───
    builder
      .addCase(createGroupThunk.fulfilled, (state, action) => {
        const newGroup = action.payload;
        state.chats.unshift(newGroup);
        state.activeChat = newGroup;
      });

    // ─── searchUsersThunk ───
    builder
      .addCase(searchUsersThunk.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchUsersThunk.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsersThunk.rejected, (state) => {
        state.searchLoading = false;
        state.searchResults = [];
      });
  },
});

export const {
  setActiveChat,
  clearActiveChat,
  updateLastMessage,
  setUserOnline,
  setUserOffline,
  setTyping,
  clearTyping,
  clearSearchResults,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
