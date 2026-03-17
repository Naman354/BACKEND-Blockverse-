import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./src/db/db.connect.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
// import hpp from "hpp";
import cookieParser from "cookie-parser";
import session from "express-session";
import { errorHandler } from "./src/middlewares/errorHandler.js";

import round1Routes from "./src/routes/Round_1.route.js";
import round2Routes from "./src/routes/Round_2.route.js";
import round3Routes from "./src/routes/Round_3.route.js";
import teamRoutes from "./src/routes/team.route.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.link1, process.env.link2],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
// app.use(hpp());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", apiLimiter);

app.disable("x-powered-by");

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.link1, process.env.link2],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// -
app.get("/", (req, res) => res.send("Blockverse backend is running..."));
app.use("/api/round1", round1Routes);
app.use("/api/round2", round2Routes);
app.use("/api/round3", round3Routes);
app.use("/api/team", teamRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log("Socket.IO active...");
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
