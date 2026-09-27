import express from "express";
import MessageController from "./message.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = express.Router();

router.use(authMiddleware);

// GET /api/messages/:chatId?page=1&limit=30 → Chat ke messages fetch karo
router.get("/:chatId", asyncHandler(MessageController.getMessages));

// DELETE /api/messages/:messageId → Message delete karo (soft delete)
router.delete("/:messageId", asyncHandler(MessageController.deleteMessage));

export default router;
