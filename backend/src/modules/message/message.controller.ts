import { Request, Response } from "express";
import Message from "../../models/message/schema";
import Chat from "../../models/chat/schema";
import { AppError, sendResponse } from "../../utils";

class MessageController {
  /**
   * GET /api/messages/:chatId → Ek chat ke saare messages fetch karo
   * Pagination support hai with page & limit query params
   */
  static async getMessages(req: Request, res: Response) {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Verify that user is a participant in this chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: { $in: [userId] },
    });

    if (!chat) {
      throw new AppError("Chat not found or access denied", 403);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chatId })
      .populate("senderId", "name avatar userName")
      .sort({ createdAt: -1 }) // Latest first
      .skip(skip)
      .limit(limit)
      .lean();

    const totalMessages = await Message.countDocuments({ chatId });

    return sendResponse(res, 200, "Messages fetched", {
      messages: messages.reverse(), // Oldest first for UI display
      pagination: {
        page,
        limit,
        total: totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
        hasNextPage: page < Math.ceil(totalMessages / limit),
      },
    });
  }

  /**
   * DELETE /api/messages/:messageId → Message delete karo (sirf apna)
   */
  static async deleteMessage(req: Request, res: Response) {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      throw new AppError("Message not found", 404);
    }

    // Sirf apna message delete kar sakte ho
    if (message.senderId.toString() !== userId.toString()) {
      throw new AppError("You can only delete your own messages", 403);
    }

    // Soft delete — DB se nahi hata, bas isDeleted = true
    await Message.findByIdAndUpdate(messageId, {
      isDeleted: true,
      content: null,
      mediaUrl: null,
    });

    return sendResponse(res, 200, "Message deleted");
  }
}

export default MessageController;
