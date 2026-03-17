console.log("Round 3 routes loaded");
import express from "express";
import {
  initRound3,
  submitRound3Answer,
} from "../controllers/round3.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/init", protect, initRound3);
router.post("/submit", protect, submitRound3Answer);
router.get("/ping", (req, res) => {
  res.json({ ok: true });
});


export default router;
