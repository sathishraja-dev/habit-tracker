import { z } from "zod";

/**
 * Validates the request body used when a user attempts to log in.
 *
 * Login validation ensures the API receives the minimum credentials required
 * to authenticate the user before the authentication service queries MongoDB
 * or performs password comparison.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be 255 characters or less")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password must be 128 characters or less"),
});
