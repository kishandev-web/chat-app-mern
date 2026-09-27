import mongoose from "mongoose";
import { IUser } from "./type";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      // required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    mobNo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      // required: true,
    },

    avatar: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model<IUser>("User", userSchema);

// export { IUser };
export default User;
