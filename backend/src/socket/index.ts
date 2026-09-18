import { Server } from "socket.io";

import { socketAuthMiddleware } from "./../middleware/authMiddleware";

import { registerMessageHandlers } from "./handlers/message.handler";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket: any) => {
    const userId = socket?.user?.id;

    console.log("User connected:", userId);

    socket.join(userId);

    // register all handlers
    registerMessageHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });
  });

  return io;
};
