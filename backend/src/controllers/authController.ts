import type { Request, Response } from "express";
import { signup } from "../services/authService.js";
import { signupSchema } from "../validators/authValidator.js";
import { login } from "../services/loginService.js";

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

/**
 * Authenticates an existing user and returns a signed JWT.
 *
 * Request validation is performed before this controller receives the
 * credentials, keeping authentication logic inside the service layer.
 */
export async function loginController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await login(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      res.status(401).json({
        success: false,
        error: {
          message: "Invalid email or password",
        },
      });

      return;
    }

    console.error("Login failed", error);

    res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
      },
    });
  }
}
