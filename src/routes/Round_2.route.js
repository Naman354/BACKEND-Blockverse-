import express from "express";
import {
  getRound2Phase1Questions,
  submitRound2Phase1Answer,
  getStoreClues,
  buyClue,
} from "../controllers/Round_2.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/phase1/questions", protect, getRound2Phase1Questions);
router.post("/phase1/submit", protect, submitRound2Phase1Answer);
router.get("/store", protect, getStoreClues);
router.post("/store/buy", protect, buyClue);

export default router;
