import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./src/db/db.connect.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.join("leaderboard");

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed:", error.message);
    process.exit(1);
  }
};

startServer();
