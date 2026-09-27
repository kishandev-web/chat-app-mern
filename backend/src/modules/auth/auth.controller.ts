import { Request, Response } from "express";
import User from "../../models/user/schema";
import admin from "../../config/firebase";
import { AppError, sendResponse, generateToken } from "../../utils";
import { avatarUpload } from "../../middleware/multerS3";

class AuthController {
  /**
   * Firebase phone OTP verify → create/login user → return JWT
   * Flow: Frontend sends Firebase ID token → we verify it → return our own JWT
   */
  static async verifyFirebaseToken(req: Request, res: Response) {
    const { token } = req.body;

    // Firebase token verify karo
    const decoded: any = await admin.auth().verifyIdToken(token);

    if (!decoded) {
      throw new AppError("Invalid or expired Firebase token", 401);
    }

    // Phone number se user dhundo
    let user = await User.findOne({ mobNo: decoded.phone_number });

    // Naya user hai toh create karo with auto-generated userName
    if (!user) {
      const userName = `user_${Date.now()}`;
      user = await User.create({
        mobNo: decoded.phone_number,
        name: "New User",
        userName,
      });
    }

    // Apna JWT banao
    const accessToken = generateToken({ id: user._id });

    return sendResponse(res, 200, "Login successful", {
      accessToken,
      user,
    });
  }

  /**
   * Profile complete karo (name, userName, avatar etc.)
   * Runs after first login — user fills their profile
   */
  static async completeProfile(req: Request, res: Response) {
    const userId: any = req.user._id;
    const file = req.file as any;
    const { name, userName, about } = req.body;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    // Check if userName is already taken by someone else
    const userNameTaken = await User.findOne({
      userName,
      _id: { $ne: userId },
    });
    if (userNameTaken) {
      throw new AppError("Username already taken", 400);
    }

    const data: any = {
      name,
      userName,
      about,
      isProfileCompleted: true,
    };

    // S3 se file ayi toh location use karo, disk path nahi
    if (file) {
      data.avatar = file.location || file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
    });

    return sendResponse(res, 200, "Profile completed successfully!", updatedUser);
  }
}

export default AuthController;

