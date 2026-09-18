import { Document, Types } from "mongoose";
export type MessageType = "text" | "image" | "video" | "audio" | "pdf";
export type MessageStatus = "sent" | "delivered" | "read";
export interface IMessage extends Document {
  senderId: Types.ObjectId;
  chatId: Types.ObjectId;
  content?: string;
  mediaUrl?: string;
  // text: string;
  // image: string;
  // video: string;
  // pdf: string;
  // audio: string;
  messageType: MessageType;
  status: MessageStatus;
  isEdited: boolean;
  isDeleted: boolean;
  deletedFor: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
