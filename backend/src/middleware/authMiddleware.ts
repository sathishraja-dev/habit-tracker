import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

/**
 * Adds authenticated user information to Express requests.
 */
export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

/**
 * Verifies the JWT supplied in the Authorization header.
 *
 * Expected format:
 * Authorization: Bearer <token>
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: {
        message: "Authentication required",
      },
    });

    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        message: "Authentication required",
      },
    });

    return;
  }

  try {
    const userId = verifyToken(token);

    (req as AuthenticatedRequest).user = {
      userId,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      error: {
        message: "Invalid or expired token",
      },
    });
  }
}
