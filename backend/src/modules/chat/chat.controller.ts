import { Request, Response } from "express";
import Chat from "../../models/chat/schema";
import { AppError, sendResponse } from "../../utils";
import User from "../../models/user/schema";

class chatController {
  static async createChat(req: Request, res: Response) {
    const senderId = req.user._id;
    const { receiverId } = req.body;
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      throw new AppError("User not found", 404);
    }

    let chat = await Chat.findOne({
      isGroup: false,
      participants: {
        $all: [senderId, receiverId],
      },
    });

    const participants =
      senderId.toString() === receiverId ? [senderId] : [senderId, receiverId];
    const data: any = {
      participants,
      chatType: senderId === receiverId ? "self" : "private",
    };

    if (!chat) {
      chat = await Chat.create(data);
    }

    return sendResponse(res, 200, "", chat);
  }
  static async createGroup(req: Request, res: Response) {
    const { groupName, participants } = req.body;
    const { id: adminId } = req.user;
    const file: any = req.file;

    const data: any = {
      groupName,
      participants: [adminId, ...participants],
      admins: [adminId],
      isGroup: true,
    };
    if (file) {
      data.groupAvatar = file?.path;
    }
    const createGroup = await Chat.create(data);
    return sendResponse(res, 200, "group create successfully", createGroup);
  }
  static async chatList(req: Request, res: Response) {
    const userId = req.user?._id;
    const list = await Chat.find({
      participants: { $in: [userId] },
    });
    sendResponse(res, 200, "fetched", list);
  }
  static async chatDetail(req: Request, res: Response) {
    const { id } = req.params;
    const details = await Chat.findOne({ _id: id });
    if (!details) {
      throw new AppError("detail not found ", 400);
    }
    sendResponse(res, 200, "", details);
  }
}
