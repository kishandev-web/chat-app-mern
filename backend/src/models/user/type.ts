import { Types } from "mongoose";
import { Document } from "mongoose";

export interface IUser extends Document {
  id: Types.ObjectId;
  name: string;
  email: string;
  userName: string;
  mobNo: string;
  password: string;
  avatar?: string;
  about: string;
  isOnline: boolean;
  isProfileCompleted: boolean;
  lastSeen: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
