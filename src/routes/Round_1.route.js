import express from "express";
import {
  submitRound1Answer,
  getRound1Questions,
} from "../controllers/Round1.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/questions", protect, getRound1Questions);
router.post("/submit", protect, submitRound1Answer);

export default router;
