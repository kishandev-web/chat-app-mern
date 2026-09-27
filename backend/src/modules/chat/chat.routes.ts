import express from "express";
import chatController from "./chat.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { asyncHandler } from "../../middleware/asyncHandler";
import { avatarUpload } from "../../middleware/multerS3";

const router = express.Router();

// Saare chat routes protected hain (authMiddleware)
router.use(authMiddleware);

// POST /api/chats/          → Private chat create karo ya existing dhundo
router.post("/", asyncHandler(chatController.createChat));

// POST /api/chats/group     → Group chat banao
router.post(
  "/group",
  avatarUpload.single("groupAvatar"),
  asyncHandler(chatController.createGroup),
);

// GET /api/chats/           → Mere saare chats lao
router.get("/", asyncHandler(chatController.chatList));

// GET /api/chats/:id        → Ek specific chat ki detail
router.get("/:id", asyncHandler(chatController.chatDetail));

export default router;
