import http from "http";
import { validateEnv } from "./config/env";
import app from "./app";
import connectDB from "./config/db";
import { initSocket } from "./socket";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ✅ Validate env variables first
    validateEnv();

    // ✅ Connect to DB
    await connectDB();

    // ✅ Create HTTP server
    const server = http.createServer(app);

    // ✅ Initialize Socket.IO
    initSocket(server);

    // ✅ Start listening
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
