import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import { initSocket } from "./socket";
import { IUser } from "./models/user/type";
dotenv.config();
declare global {
  namespace Express {
    interface Request {
      user: IUser;
      file?: File;
      // files?: Express.Multer.File[];
    }
  }

  interface Array<T> {
    parseToString(): Array<T>;
    parseToObjectId(): Array<T>;
  }
}
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Server running...");
});

app.use("/api/auth", authRoutes);

export default app;
