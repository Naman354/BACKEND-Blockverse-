import express from "express";
import {
  initRound2,
  getRound2Phase1Questions,
  submitRound2Phase1Answer,
  getStoreClues,
  buyClue,
  getRound2Progress,
} from "../controllers/Round2.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// initialize round 2
router.post("/init", protect, initRound2);

router.get("/questions", protect, getRound2Phase1Questions);

router.post("/submit", protect, submitRound2Phase1Answer);

// clue store
router.get("/store", protect, getStoreClues);

// buy clue
router.post("/store/buy", protect, buyClue);

// progress
router.get("/progress", protect, getRound2Progress);

export default router;