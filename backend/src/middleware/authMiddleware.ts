import { verifyToken } from "../utils/jwt";
import User from "../models/user/schema";

export const authMiddleware = async (req: any, res: any, next: any) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required." });
  }
  if (!authorization.startsWith("Bearer "))
    return res.status(403).send("Authorization token required.");

  const token = authorization.split(" ")[1];

  try {
    const decoded: any = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error: any) {
    console.error("[authMiddleware] Token verification error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const socketAuthMiddleware = (socket: any, next: any) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;

    if (!token) {
      return next(new Error("Unauthorized: No token provided"));
    }

    const decoded = verifyToken(token);
    socket.user = decoded;
    next();

  } catch (error) {
    next(new Error("Unauthorized: Invalid token"));
  }
};
