import { Router } from "express";
import { createHabitLog } from "../controllers/habitController.js";

const router = Router();

/**
 * Registers the endpoint used to create or update today's habit log.
 */
router.post("/logs", createHabitLog);

export default router;
