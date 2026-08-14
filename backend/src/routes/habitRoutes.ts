import { Router } from "express";
import { createHabitLog } from "../controllers/habitController.js";
import { getDashboardController } from "../controllers/dashboardController.js";

const router = Router();

/**
 * Registers the endpoint used to create or update today's habit log.
 */
router.post("/logs", createHabitLog);

/**
 * Registers the endpoint used by the frontend to retrieve the user's
 * current streaks and seven-day progress.
 */
router.get("/dashboard/:userId", getDashboardController);

export default router;
