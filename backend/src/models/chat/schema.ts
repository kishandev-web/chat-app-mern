import { IChat } from "./type";
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema<IChat>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: null,
    },
    groupAvatar: String,
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    muteBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chatType: {
      type: String,
      enum: ["private", "group", "self"],
      default: "private",
    },
  },
  {
    timestamps: true,
  },
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
