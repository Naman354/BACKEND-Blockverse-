import express from "express";
import {
  submitRound1Answer,
  getRound1Questions,
  getRound1Progress,
} from "../controllers/Round1.cotroller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/questions", protect, getRound1Questions);
router.post("/submit", protect, submitRound1Answer);
router.get("/progress", protect, getRound1Progress);

export default router;
