import { Types } from "mongoose";
import { Document } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email?: string;           // Optional - phone auth app mein email required nahi
  userName: string;
  mobNo: string;
  password?: string;        // Optional - firebase auth use karte hain
  avatar?: string;
  about?: string;
  isOnline: boolean;
  isProfileCompleted: boolean;
  lastSeen?: Date;          // Last time user was online
  createdAt: Date;
  updatedAt: Date;
}
