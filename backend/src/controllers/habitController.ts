import type { Request, Response } from "express";
import { logHabit } from "../services/habitService.js";
import { createHabitLogSchema } from "../validators/habitValidator.js";

/**
 * Handles HTTP requests for logging a daily habit.
 *
 * The authenticated user's ID comes from the verified JWT rather than
 * from client-supplied request data.
 */
export async function createHabitLog(
  req: Request,
  res: Response,
): Promise<void> {
  const result = createHabitLogSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: "Invalid request",
      details: result.error.flatten(),
    });

    return;
  }

  const userId = req.user!.userId;

  try {
    const log = await logHabit({
      userId,
      ...result.data,
    });

    res.status(201).json({
      success: true,
      log,
    });
  } catch (error) {
    console.error("Failed to create habit log", error);

    if (error instanceof Error && error.name === "UserNotFoundError") {
      res.status(404).json({
        success: false,
        error: "User not found",
      });

      return;
    }

    res.status(500).json({
      success: false,
      error: "Failed to create habit log",
    });
  }
}
