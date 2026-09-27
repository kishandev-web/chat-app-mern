import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import messageApi from "../../api/messageApi";

export const fetchMessagesThunk = createAsyncThunk(
  "message/fetchMessages",
  async ({ chatId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await messageApi.getMessages(chatId, page, limit);
      return {
        chatId,
        messages: response.data.messages,
        pagination: response.data.pagination,
        isInitial: page === 1,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMessageThunk = createAsyncThunk(
  "message/deleteMessage",
  async ({ messageId, chatId }, { rejectWithValue }) => {
    try {
      await messageApi.deleteMessage(messageId);
      return { messageId, chatId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messagesByChat: {}, // { [chatId]: { list: [], pagination: {} } }
    loading: false,
    error: null,
  },
  reducers: {
    addIncomingMessage: (state, action) => {
      const message = action.payload;
      const chatId = message.chatId;

      if (!state.messagesByChat[chatId]) {
        state.messagesByChat[chatId] = {
          list: [],
          pagination: { page: 1, hasNextPage: false, total: 1 },
        };
      }

      const existingIndex = state.messagesByChat[chatId].list.findIndex(
        (m) => m._id === message._id
      );

      if (existingIndex === -1) {
        state.messagesByChat[chatId].list.push(message);
      } else {
        // Replace in case populated details were returned
        state.messagesByChat[chatId].list[existingIndex] = message;
      }
    },

    markMessagesAsReadAck: (state, action) => {
      const { chatId, messageIds } = action.payload;
      const chatState = state.messagesByChat[chatId];
      if (chatState?.list) {
        chatState.list.forEach((msg) => {
          if (messageIds.includes(msg._id)) {
            msg.status = "read";
          }
        });
      }
    },

    resetMessagesState: (state) => {
      state.messagesByChat = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ─── fetchMessagesThunk ───
    builder
      .addCase(fetchMessagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, messages, pagination, isInitial } = action.payload;

        if (isInitial || !state.messagesByChat[chatId]) {
          state.messagesByChat[chatId] = {
            list: messages,
            pagination,
          };
        } else {
          // Prepend older messages
          const existingList = state.messagesByChat[chatId].list;
          const newUnique = messages.filter(
            (m) => !existingList.some((e) => e._id === m._id)
          );
          state.messagesByChat[chatId].list = [...newUnique, ...existingList];
          state.messagesByChat[chatId].pagination = pagination;
        }
      })
      .addCase(fetchMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ─── deleteMessageThunk ───
    builder.addCase(deleteMessageThunk.fulfilled, (state, action) => {
      const { messageId, chatId } = action.payload;
      const chatState = state.messagesByChat[chatId];
      if (chatState?.list) {
        const msg = chatState.list.find((m) => m._id === messageId);
        if (msg) {
          msg.isDeleted = true;
          msg.content = "This message was deleted";
          msg.mediaUrl = null;
        }
      }
    });
  },
});

export const { addIncomingMessage, markMessagesAsReadAck, resetMessagesState } =
  messageSlice.actions;

export default messageSlice.reducer;
