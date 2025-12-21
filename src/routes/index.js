import express from "express";

import round1Routes from "./Round_1.route.js";
import round2Routes from "./Round_2.route.js";
import teamRoutes from "./team.route.js";

const router = express.Router();

router.use("/round1", round1Routes);
router.use("/round2", round2Routes);
router.use("/team", teamRoutes);

export default router;
