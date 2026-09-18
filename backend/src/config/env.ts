import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user/schema";
import admin from "../config/firebase";

class AuthController {
  static async verifyFirebaseToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Token missing",
        });
      }

      // verify firebase token
      const decoded = await admin.auth().verifyIdToken(token);

      const phone = decoded.phone_number;

      // find user
      let user = await User.findOne({
        mobNo: phone,
      });

      // create user if not exists
      if (!user) {
        user = await User.create({
          mobNo: phone,
          name: "New User",
        });
      }

      // create your own jwt
      const accessToken = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        },
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        user,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Authentication failed",
      });
    }
  }
}

export default AuthController;
