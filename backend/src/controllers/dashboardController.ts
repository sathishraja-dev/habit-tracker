import type { Request, Response } from "express";
import mongoose from "mongoose";
import { getDashboard } from "../services/dashboardServices";

/**
 * Handles requests for the user's dashboard.
 *
 * The controller validates the route parameter, delegates dashboard
 * calculations to the service, and maps service results to HTTP responses.
 */
export async function getDashboardController(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.params.userId;
  if (typeof userId !== "string") {
    res.status(400).json({
      success: false,
      error: "Invalid userId",
    });

    return;
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({
      success: false,
      error: "Invalid userId",
    });

    return;
  }

  try {
    const dashboard = await getDashboard(userId);

    if (!dashboard) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("Failed to load dashboard", error);

    res.status(500).json({
      success: false,
      error: "Failed to load dashboard",
    });
  }
}
