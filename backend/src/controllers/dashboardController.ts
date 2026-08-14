import type { Request, Response } from "express";
import { getDashboard } from "../services/dashboardServices.js";

/**
 * Handles requests for the authenticated user's dashboard.
 *
 * The user ID comes from the verified JWT attached to the request by the
 * authentication middleware. The controller delegates dashboard calculations
 * to the service and maps service results to HTTP responses.
 */
export async function getDashboardController(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.userId;

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
