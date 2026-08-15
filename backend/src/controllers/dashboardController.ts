import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { getDashboard } from "../services/dashboardServices.js";

/**
 * Handles requests for the authenticated user's dashboard.
 *
 * The user ID comes from the verified JWT rather than from a URL parameter.
 */
export async function getDashboardController(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = (req as AuthenticatedRequest).user.userId;

  try {
    const dashboard = await getDashboard(userId);

    if (!dashboard) {
      res.status(404).json({
        success: false,
        error: {
          message: "User not found",
        },
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
      error: {
        message: "Failed to load dashboard",
      },
    });
  }
}
