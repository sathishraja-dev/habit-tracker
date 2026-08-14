import type { Request, Response } from "express";
import { signup } from "../services/authService.js";
import { signupSchema } from "../validators/authValidator.js";

/**
 * Handles HTTP requests for user registration.
 *
 * The controller is responsible for HTTP concerns only: validating the
 * incoming request, calling the authentication service, and translating
 * service results into appropriate HTTP responses.
 */
export async function signupController(
  req: Request,
  res: Response,
): Promise<void> {
  const validationResult = signupSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      error: {
        message: "Invalid request data",
        details: validationResult.error.flatten(),
      },
    });

    return;
  }

  try {
    const user = await signup(validationResult.data);

    res.status(201).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      res.status(409).json({
        success: false,
        error: {
          message: "Email is already registered",
        },
      });

      return;
    }

    console.error("Signup failed", error);

    res.status(500).json({
      success: false,
      error: {
        message: "Unable to create account",
      },
    });
  }
}
