import { SOCKET_EVENTS } from "../events";
import Chat from "../../models/chat/schema";

/**
 * Chat Room Handlers
 *
 * Hinglish explanation:
 * Ye handlers chat room related events handle karte hain.
 *
 * - JOIN_CHAT: User ek specific chatId ke room mein join karta hai.
 *   Bina join kiye RECEIVE_MESSAGE nahi milega.
 *
 * - LEAVE_CHAT: User room se bahar nikalta hai (optional, disconnect pe auto hota hai)
 *
 * - TYPING / STOP_TYPING: "...typing" indicator
 *   Server sirf forward karta hai — doosre participants ko dikhata hai
 */
export const registerChatHandlers = (io: any, socket: any) => {
  // ─── JOIN CHAT ────────────────────────────────────────────────────────────
  // Client emit karta hai: socket.emit("join_chat", chatId)
  socket.on(SOCKET_EVENTS.JOIN_CHAT, async (chatId: string) => {
    try {
      const userId = socket.user?.id;

      // Security check: Sirf valid participants hi join kar sakein
      const chat = await Chat.findOne({
        _id: chatId,
        participants: { $in: [userId] },
      });

      if (!chat) {
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: "Chat not found or you are not a participant",
        });
        return;
      }

      // Socket.IO room mein join karo (chatId = room name)
      socket.join(chatId);
      console.log(`✅ User [${userId}] joined chat room [${chatId}]`);

    } catch (err) {
      console.error("JOIN_CHAT error:", err);
      socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to join chat" });
    }
  });

  // ─── LEAVE CHAT ───────────────────────────────────────────────────────────
  // Client emit karta hai: socket.emit("leave_chat", chatId)
  socket.on(SOCKET_EVENTS.LEAVE_CHAT, (chatId: string) => {
    socket.leave(chatId);
    console.log(`User [${socket.user?.id}] left chat room [${chatId}]`);
  });

  // ─── TYPING ───────────────────────────────────────────────────────────────
  // Client emit karta hai: socket.emit("typing", { chatId })
  // Server forward karta hai baaki room members ko
  socket.on(SOCKET_EVENTS.TYPING, ({ chatId }: { chatId: string }) => {
    // socket.to() matlab: "mujhe chhodke sabko bhejo"
    socket.to(chatId).emit(SOCKET_EVENTS.TYPING, {
      chatId,
      userId: socket.user?.id,
    });
  });

  // ─── STOP TYPING ──────────────────────────────────────────────────────────
  // Client emit karta hai: socket.emit("stop_typing", { chatId })
  socket.on(SOCKET_EVENTS.STOP_TYPING, ({ chatId }: { chatId: string }) => {
    socket.to(chatId).emit(SOCKET_EVENTS.STOP_TYPING, {
      chatId,
      userId: socket.user?.id,
    });
  });
};

