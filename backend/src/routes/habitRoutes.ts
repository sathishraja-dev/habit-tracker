import { Router } from "express";
import { createHabitLog } from "../controllers/habitController.js";
import { getDashboardController } from "../controllers/dashboardController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * Registers the endpoint used to create or update today's habit log.
 */
router.post("/logs", requireAuth, createHabitLog);
/**
 * Registers the authenticated user's dashboard endpoint.
 *
 * Authentication runs before the controller so the controller receives
 * the user ID from the verified JWT instead of trusting a URL parameter.
 */
router.get("/dashboard", requireAuth, getDashboardController);

export default router;
