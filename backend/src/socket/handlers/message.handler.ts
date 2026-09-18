import Message from "../../models/message/schema";
import Chat from "../../models/chat/schema";
import { SOCKET_EVENTS } from "../events";

export const registerMessageHandlers = (io: any, socket: any) => {
  // console.log("soclk", socket);
  console.log(">>>>>>2315", SOCKET_EVENTS.SEND_MESSAGE);
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: any) => {
    console.log("AAAAAAAAAAAAAAAAA");
    console.log("987", data);
    const { chatId, content } = data;
    console.log("1223", socket.user.id);
    console.log("1224443", socket.user.userId);
    const message = await Message.create({
      senderId: socket.user.id,
      chatId,
      content,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "senderId",
    );

    io.to(chatId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, populatedMessage);
  });
};
