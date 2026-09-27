import { Request, Response } from "express";
import Chat from "../../models/chat/schema";
import { AppError, sendResponse } from "../../utils";
import User from "../../models/user/schema";

class chatController {
  /**
   * Private/Self chat create karo ya existing dhundo
   * POST /api/chats
   */
  static async createChat(req: Request, res: Response) {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    // Receiver exist karta hai?
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      throw new AppError("User not found", 404);
    }

    // Already chat hai toh naya mat banao
    let chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      const isSelf = senderId.toString() === receiverId;
      chat = await Chat.create({
        participants: isSelf ? [senderId] : [senderId, receiverId],
        chatType: isSelf ? "self" : "private",
        isGroup: false,
      });
    }

    return sendResponse(res, 200, "Chat ready", chat);
  }

  /**
   * Group chat banao
   * POST /api/chats/group
   */
  static async createGroup(req: Request, res: Response) {
    const { groupName, participants } = req.body;
    const adminId = req.user._id;
    const file: any = req.file;

    const data: any = {
      groupName,
      participants: [adminId, ...participants],
      admins: [adminId],
      isGroup: true,
      chatType: "group",
    };

    // S3 ya local file path
    if (file) {
      data.groupAvatar = file.location || file.path;
    }

    const group = await Chat.create(data);
    return sendResponse(res, 201, "Group created successfully", group);
  }

  /**
   * Mere saare chats lao
   * GET /api/chats
   */
  static async chatList(req: Request, res: Response) {
    const userId = req.user._id;

    const list = await Chat.find({
      participants: { $in: [userId] },
    })
      .populate("participants", "name avatar userName isOnline lastSeen")
      .populate("lastMessage")
      .sort({ updatedAt: -1 }); // Latest activity pehle

    return sendResponse(res, 200, "Chats fetched", list);
  }

  /**
   * Ek specific chat ki detail
   * GET /api/chats/:id
   */
  static async chatDetail(req: Request, res: Response) {
    const { id } = req.params;

    const details = await Chat.findById(id).populate(
      "participants",
      "name avatar userName isOnline lastSeen",
    );

    if (!details) {
      throw new AppError("Chat not found", 404);
    }

    return sendResponse(res, 200, "Chat detail fetched", details);
  }
}

export default chatController;
