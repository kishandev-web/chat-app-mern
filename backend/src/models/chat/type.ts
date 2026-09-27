import { Document, Types } from "mongoose";
export interface IChat extends Document {
  participants: Types.ObjectId[];  // Array of user IDs in this chat
  isGroup: boolean;
  groupName: String;
  groupAvatar: String;
  admins: Types.ObjectId[];
  lastMessage: Types.ObjectId;
  muteBy: Types.ObjectId;
  archivedBy: Types.ObjectId;
  deletedFor: Types.ObjectId[];
  chatType: "private" | "group" | "self";
  createdAt: Date;
  updatedAt: Date;
}
