import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
// import {
//   securityHeaders,
//   apiLimiter,
//   detectBot,
// } from "./src/middlewares/security.js";
// import { sanitizeRequest } from "./src/middlewares/sanitizeRequests.js";
import routes from "./src/routes/index.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://blockverse-iota.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const app = express();
//const { link1, link2 } = process.env;

// app.use(securityHeaders);
// app.use(hpp());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(detectBot);
// app.use("/api", apiLimiter);
// app.use(sanitizeRequest);

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);


app.get("/", (req, res) => {
  res.send("Blockverse Backend is running.....");
});

app.use("/api", routes);
app.use(errorHandler);

export default app;
