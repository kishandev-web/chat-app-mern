import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import AuthController from "./auth.controller";
import { validator } from "../../middleware/yupValidation";
import { verifyTokenValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/verify-token",
  validator(verifyTokenValidation),
  AuthController.verifyFirebaseToken,
);

export default router;
