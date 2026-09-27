/**
 * Socket.IO Event Constants
 *
 * Hinglish explanation:
 * Ye ek centralized object hai jahan saare socket event names defined hain.
 * Isko import karke use karo — directly string mat likho
 * taaki typo se bugs na aayein.
 *
 * Architecture:
 *  Client  →  Server  (client emit karta hai, server sun-ta hai)
 *  Server  →  Client  (server emit karta hai, client sun-ta hai)
 *  Server  →  Room    (server ek poori room ko emit karta hai)
 */
export const SOCKET_EVENTS = {
  // ─── Chat Room Management ─────────────────────────────────────────────────
  JOIN_CHAT: "join_chat",       // Client → Server: Ek chat room mein join karo
  LEAVE_CHAT: "leave_chat",     // Client → Server: Chat room chhoddo

  // ─── Messaging ────────────────────────────────────────────────────────────
  SEND_MESSAGE: "send_message",         // Client → Server: Message bhejo
  RECEIVE_MESSAGE: "receive_message",   // Server → Room:   Naya message aaya

  // ─── Read Receipts ────────────────────────────────────────────────────────
  MESSAGE_READ: "message_read",         // Client → Server: Maine padh liya
  MESSAGE_READ_ACK: "message_read_ack", // Server → Sender: Read receipt confirm

  // ─── Typing Indicators ────────────────────────────────────────────────────
  TYPING: "typing",             // Client → Server → Others: Typing chal rahi hai
  STOP_TYPING: "stop_typing",   // Client → Server → Others: Typing ruk gayi

  // ─── Online Status ────────────────────────────────────────────────────────
  USER_ONLINE: "user_online",   // Server → All: User online aaya
  USER_OFFLINE: "user_offline", // Server → All: User offline gaya

  // ─── Error ────────────────────────────────────────────────────────────────
  ERROR: "error",               // Server → Client: Kuch galat hua
} as const;

// TypeScript type for type-safe event names
export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

