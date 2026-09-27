import { io } from "socket.io-client";
import {
  addIncomingMessage,
  markMessagesAsReadAck,
} from "../store/slices/messageSlice";
import {
  updateLastMessage,
  setUserOnline,
  setUserOffline,
  setTyping,
  clearTyping,
} from "../store/slices/chatSlice";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

let socket = null;

export const initSocket = (token, dispatch) => {
  if (!token) return null;

  // Agar already connected hai with same token, re-use karo
  if (socket && socket.connected) {
    return socket;
  }

  // Purana socket disconnect karo agar exist karta hai
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected successfully:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.warn("⚠️ Socket connection error:", error.message);
  });

  // ─── Real-time Event Listeners ─────────────────────────────────────────────

  // 1. Naya message aaya
  socket.on("receive_message", (message) => {
    dispatch(addIncomingMessage(message));
    dispatch(updateLastMessage(message));
  });

  // 2. Read receipt acknowledgement (Blue ticks ✓✓)
  socket.on("message_read_ack", ({ chatId, messageIds, readerId }) => {
    dispatch(markMessagesAsReadAck({ chatId, messageIds, readerId }));
  });

  // 3. User typing status
  socket.on("typing", ({ chatId, userId }) => {
    dispatch(setTyping({ chatId, userId }));
  });

  // 4. User stop typing status
  socket.on("stop_typing", ({ chatId, userId }) => {
    dispatch(clearTyping({ chatId, userId }));
  });

  // 5. User online presence
  socket.on("user_online", ({ userId }) => {
    dispatch(setUserOnline({ userId }));
  });

  // 6. User offline presence
  socket.on("user_offline", ({ userId, lastSeen }) => {
    dispatch(setUserOffline({ userId, lastSeen }));
  });

  // 7. Error event
  socket.on("error", (errorData) => {
    console.error("❌ Socket error received:", errorData?.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔴 Socket disconnected");
  }
};

// ─── Emitter Helpers ─────────────────────────────────────────────────────────

export const joinChatRoom = (chatId) => {
  if (socket && socket.connected && chatId) {
    socket.emit("join_chat", chatId);
  }
};

export const leaveChatRoom = (chatId) => {
  if (socket && socket.connected && chatId) {
    socket.emit("leave_chat", chatId);
  }
};

export const emitSendMessage = ({ chatId, content, messageType = "text", mediaUrl }) => {
  if (socket && socket.connected) {
    socket.emit("send_message", {
      chatId,
      content,
      messageType,
      mediaUrl,
    });
  }
};

export const emitTyping = (chatId) => {
  if (socket && socket.connected && chatId) {
    socket.emit("typing", { chatId });
  }
};

export const emitStopTyping = (chatId) => {
  if (socket && socket.connected && chatId) {
    socket.emit("stop_typing", { chatId });
  }
};

export const emitMessageRead = ({ chatId, messageIds }) => {
  if (socket && socket.connected && chatId && messageIds?.length > 0) {
    socket.emit("message_read", { chatId, messageIds });
  }
};
