import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { asyncHandler } from "../../middleware/asyncHandler";
import User from "../../models/user/schema";
import { sendResponse, AppError } from "../../utils";

const router = express.Router();

router.use(authMiddleware);

// GET /api/users/search?q=username → Users dhundo by name/username
router.get(
  "/search",
  asyncHandler(async (req: any, res: any) => {
    const { q } = req.query;
    if (!q) throw new AppError("Search query required", 400);

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { userName: { $regex: q, $options: "i" } },
      ],
      _id: { $ne: req.user._id }, // apne aap ko exclude karo
    }).select("name userName avatar isOnline lastSeen");

    return sendResponse(res, 200, "Users found", users);
  }),
);

// GET /api/users/me → Apni profile dekho
router.get(
  "/me",
  asyncHandler(async (req: any, res: any) => {
    return sendResponse(res, 200, "Profile fetched", req.user);
  }),
);

export default router;
