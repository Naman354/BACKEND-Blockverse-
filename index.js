import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import connectDB from "./src/db/db.connect.js";

// import {
//   securityHeaders,
//   apiLimiter,
//   detectBot,
// } from "./src/middlewares/security.js";
// import { sanitizeRequest } from "./src/middlewares/sanitizeRequests.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

// Routes
import teamRoutes from "./src/routes/team.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const { link1, link2 } = process.env;

// app.use(securityHeaders);
// app.use(hpp());
app.use(
  cors({
    origin: ["http://localhost:5173", link1, link2],
    credentials: true,
  })
);
app.use(express.json());
// app.use(detectBot);
// app.use("/api", apiLimiter);
// app.use(sanitizeRequest);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set to true when using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// app.use(passport.initialize());
// app.use(passport.session());

app.get("/", (req, res) => res.send("Blockverse Backend is running....."));

app.use("/api/team", teamRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
