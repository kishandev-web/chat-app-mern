import { Request, Response } from "express";
import User from "../../models/user/schema";
import admin from "../../config/firebase";
import { AppError, sendResponse, generateToken } from "../../utils";

class AuthController {
  static async verifyFirebaseToken(req: Request, res: Response) {
    const { token } = req.body;

    const decoded: any = await admin.auth().verifyIdToken(token);
    console.log(">>>>>", decoded);
    if (!decoded) {
      throw new AppError("Invalid or expire token");
    }

    let user = await User.findOne({
      mobNo: decoded.phone_number,
    });
    const userName = `user_${decoded.phone_number}`;
    if (!user) {
      user = await User.create({
        mobNo: decoded.phone_number,
        name: "New User",
        userName,
      });
    }
    const accessToken = generateToken({
      id: user._id,
    });
    console.log(">>>>qqwjisqws", accessToken);
    console.log("acc", accessToken);
    return sendResponse(res, 200, "Login successful", accessToken);
  }

  static async completeProfile(req: Request, res: Response) {
    const userId: any = req.user._id;
    const file = req.file as any;
    const { name, userName, about, bio } = req.body;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return sendResponse(res, 404, "User not found");
    }
    const data: any = {
      name,
      userName,
      about,
      bio,
      isProfileCompleted: true,
    };
    if (file) {
      data.avatar = file?.path;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
    });
    return sendResponse(
      res,
      200,
      "Profile completed successfully!",
      updatedUser,
    );
  }
}

export default AuthController;
