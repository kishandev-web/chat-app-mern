import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import AuthController from "./auth.controller";
import { validator } from "../../middleware/yupValidation";
import { verifyTokenValidation, completeProfilevalidation } from "./auth.validation";
import { asyncHandler } from "../../middleware/asyncHandler";
import { avatarUpload } from "../../middleware/multerS3";

const router = express.Router();

// POST /api/auth/verify-token → Firebase token verify karo, JWT lo
router.post(
  "/verify-token",
  validator(verifyTokenValidation),
  asyncHandler(AuthController.verifyFirebaseToken),
);

// POST /api/auth/complete-profile → Profile complete karo (protected)
router.post(
  "/complete-profile",
  authMiddleware,
  avatarUpload.single("avatar"),
  validator(completeProfilevalidation),
  asyncHandler(AuthController.completeProfile),
);

export default router;

