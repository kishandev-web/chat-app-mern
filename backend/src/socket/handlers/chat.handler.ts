import { SOCKET_EVENTS } from "../events";

export const registerChatHandlers = (io: any, socket: any) => {
  socket.on(SOCKET_EVENTS.JOIN_CHAT, (chatId: string) => {
    socket.join(chatId);

    console.log("Joined chat:", chatId);
  });
};
