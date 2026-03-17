import { Router } from "express";
import { loginTeam, registerTeam } from "../controllers/team.controller.js";

const router = Router();

router.post("/register", registerTeam);
router.post("/login", loginTeam);

export default router;
