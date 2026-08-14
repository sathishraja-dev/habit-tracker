import { z } from "zod";

/**
 * Validates the request body used to create a new user account.
 *
 * Validation happens at the API boundary so malformed or unsafe input is
 * rejected before the authentication service performs password hashing or
 * database operations.
 */
export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be 255 characters or less")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be 128 characters or less"),
});
