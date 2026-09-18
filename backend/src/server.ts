// import app from "./app";
// import connectDB from "./config/db";

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   await connectDB();

//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// };

// startServer();

import http from "http";
import app from "./app";
import connectDB from "./config/db";
import { initSocket } from "./socket";
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();

    // create http server
    const server = http.createServer(app);

    // initialize socket
    initSocket(server);

    // start server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
