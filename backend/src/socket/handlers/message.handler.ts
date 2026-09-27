import Message from "../../models/message/schema";
import Chat from "../../models/chat/schema";
import { SOCKET_EVENTS } from "../events";

/**
 * Message Handlers
 *
 * Hinglish explanation:
 * Ye handlers messaging se related events handle karte hain.
 *
 * - SEND_MESSAGE: Client message data bhejta hai
 *   → Server DB mein save karta hai
 *   → Poore chat room ko RECEIVE_MESSAGE emit karta hai
 *
 * - MESSAGE_READ: Client batata hai "main ye messages padh liya"
 *   → Server DB update karta hai
 *   → Sender ko MESSAGE_READ_ACK bhejta hai (tick tick ✓✓)
 */
export const registerMessageHandlers = (io: any, socket: any) => {
  // ─── SEND MESSAGE ─────────────────────────────────────────────────────────
  // Client emit karta hai:
  // socket.emit("send_message", { chatId, content, messageType?, mediaUrl? })
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: any) => {
    try {
      const { chatId, content, messageType = "text", mediaUrl } = data;
      const senderId = socket.user?.id;

      // Basic validation
      if (!chatId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: "chatId is required" });
        return;
      }
      if (!content && !mediaUrl) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: "content or mediaUrl is required" });
        return;
      }

      // ✅ Step 1: Message DB mein save karo
      const message = await Message.create({
        senderId,
        chatId,
        content: content || null,
        messageType,
        mediaUrl: mediaUrl || null,
        status: "sent",
      });

      // ✅ Step 2: Chat ka lastMessage update karo (sidebar ke liye)
      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: message._id,
      });

      // ✅ Step 3: Sender ki details populate karo
      const populatedMessage = await Message.findById(message._id).populate(
        "senderId",
        "name avatar userName isOnline",
      );

      // ✅ Step 4: Poore chat room ko message bhejo
      // (sender + sabhi participants jinhone JOIN_CHAT kiya hai)
      io.to(chatId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, populatedMessage);

    } catch (err) {
      console.error("❌ SEND_MESSAGE error:", err);
      socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to send message" });
    }
  });

  // ─── MESSAGE READ ─────────────────────────────────────────────────────────
  // Client emit karta hai (jab user chat open karta hai):
  // socket.emit("message_read", { chatId, messageIds: ["id1", "id2"] })
  socket.on(
    SOCKET_EVENTS.MESSAGE_READ,
    async ({ chatId, messageIds }: { chatId: string; messageIds: string[] }) => {
      try {
        const readerId = socket.user?.id;

        if (!messageIds || messageIds.length === 0) return;

        // ✅ Step 1: Jinke messages hain (sender) unke message status "read" karo
        // Apne khud ke messages ki status nahi change karni
        await Message.updateMany(
          {
            _id: { $in: messageIds },
            senderId: { $ne: readerId }, // mera nahi hai toh hi update karo
            status: { $ne: "read" },
          },
          { status: "read" },
        );

        // ✅ Step 2: Sender ko batao "teri messages padh li gayi" (blue ticks ✓✓)
        socket.to(chatId).emit(SOCKET_EVENTS.MESSAGE_READ_ACK, {
          chatId,
          messageIds,
          readerId,
        });

      } catch (err) {
        console.error("❌ MESSAGE_READ error:", err);
        socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to mark messages as read" });
      }
    },
  );
};

