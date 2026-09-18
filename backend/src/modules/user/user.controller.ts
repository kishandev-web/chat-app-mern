import { Request, Response } from "express";
import Chat from "../../models/chat/schema";
import User from "../../models/user/schema";
import { AppError, sendResponse } from "../../utils";
import { findOne } from "./../../utils/dbQueries";

class userController {
  static async startChat(req: Request, res: Response) {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    let chat = await Chat.findOne({
      isGroup: false,
      participants: {
        $all: [senderId, receiverId],
      },
    });

    const data: any = {
      participants: [senderId, receiverId],
    };

    if (!chat) {
      chat = await Chat.create(data);
    }

    return sendResponse(res, 200, "", chat);
  }
}
