import mongoose from "mongoose";
import { IMessage } from "./type";

const messageSchema = new mongoose.Schema<IMessage>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    content: {
      type: String,
      default: null,
    },

    mediaUrl: {
      type: String,
      default: null,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "pdf"],
      default: "text",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // replyTo: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Message",
    // },
    //     readBy: [
    //    {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User"
    //    }
    // ]
  },
  { timestamps: true },
);

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
