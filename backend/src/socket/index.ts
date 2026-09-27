import { Server } from "socket.io";
import { socketAuthMiddleware } from "./../middleware/authMiddleware";
import { registerMessageHandlers } from "./handlers/message.handler";
import { registerChatHandlers } from "./handlers/chat.handler";
import { SOCKET_EVENTS } from "./events";
import User from "../models/user/schema";

/**
 * Online Users Map
 *
 * Hinglish: Ye ek in-memory Map hai jo track karta hai kaun online hai.
 * Key = userId (string), Value = socketId (string)
 *
 * Usage:
 *   onlineUsers.get(userId)  → socketId milega
 *   onlineUsers.has(userId)  → true/false (online hai ya nahi)
 *
 * ⚠️ Note: Ye sirf single-server setup ke liye theek hai.
 *   Multiple servers pe Redis use karo (Redis Adapter).
 */
export const onlineUsers = new Map<string, string>();

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    },
    // Client 25 seconds mein ping bhejta hai, 60 seconds mein timeout
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ─── AUTH MIDDLEWARE ───────────────────────────────────────────────────────
  // Har connection pe pehle JWT verify hoga
  // Invalid token → connection reject
  io.use(socketAuthMiddleware);

  // ─── CONNECTION ───────────────────────────────────────────────────────────
  io.on("connection", async (socket: any) => {
    const userId = socket.user?.id as string;

    if (!userId) {
      console.warn("⚠️ Socket connection without userId, disconnecting...");
      socket.disconnect();
      return;
    }

    console.log(`✅ User connected: [${userId}] → socket [${socket.id}]`);

    // ✅ Step 1: Online users map mein add karo
    onlineUsers.set(userId, socket.id);

    // ✅ Step 2: User ka personal room join karo
    // Iska use: Direct notifications (e.g., aapko kisi ne message kiya)
    socket.join(userId);

    // ✅ Step 3: DB mein isOnline = true karo
    await User.findByIdAndUpdate(userId, { isOnline: true }).catch(console.error);

    // ✅ Step 4: Baaki sabko batao "ye user online aa gaya"
    socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, { userId });

    // ─── REGISTER HANDLERS ─────────────────────────────────────────────────
    // Chat related: JOIN_CHAT, LEAVE_CHAT, TYPING, STOP_TYPING
    registerChatHandlers(io, socket);

    // Message related: SEND_MESSAGE, MESSAGE_READ
    registerMessageHandlers(io, socket);

    // ─── DISCONNECT ────────────────────────────────────────────────────────
    socket.on("disconnect", async (reason: string) => {
      console.log(`❌ User disconnected: [${userId}] reason: ${reason}`);

      // ✅ Step 1: Online map se hata do
      onlineUsers.delete(userId);

      // ✅ Step 2: DB mein offline mark karo + lastSeen update karo
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      }).catch(console.error);

      // ✅ Step 3: Baaki sabko batao "ye user offline ho gaya"
      socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, {
        userId,
        lastSeen: new Date(),
      });
    });
  });

  return io;
};

