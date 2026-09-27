import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { IUser } from "./models/user/type";

// ─── Routes ───────────────────────────────────────────────────────────────────
import authRoutes from "./modules/auth/auth.routes";
import chatRoutes from "./modules/chat/chat.routes";
import userRoutes from "./modules/user/user.routes";
import messageRoutes from "./modules/message/message.routes";

// ─── Middleware ───────────────────────────────────────────────────────────────
import { errorMiddleware } from "./middleware/errorMiddleware";

dotenv.config();

// Extend Express Request so req.user is typed everywhere
declare global {
  namespace Express {
    interface Request {
      user: IUser;
      file?: Express.Multer.File;
    }
  }
}

const app = express();

// ─── CORS Setup ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.send("🚀 Chat App Server running...");
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// ─── Global Error Handler (MUST be after all routes) ─────────────────────────
app.use(errorMiddleware);

export default app;
