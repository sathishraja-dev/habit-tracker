import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "1h";

/**
 * Returns the JWT secret from the environment.
 *
 * Keeping the secret in an environment variable prevents credentials from
 * being hard-coded in source code or accidentally committed to Git.
 *
 * @returns The configured JWT secret.
 * @throws Error when JWT_SECRET is missing from the environment.
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

/**
 * Creates a signed JWT containing the authenticated user's ID.
 *
 * The token allows subsequent requests to prove which user has authenticated
 * without requiring the client to send a user ID that could be manipulated.
 *
 * @param userId - MongoDB ID of the authenticated user.
 * @returns A signed JWT that expires after the configured lifetime.
 */
export function generateToken(userId: string): string {
  return jwt.sign(
    {
      userId,
    },
    getJwtSecret(),
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
}

/**
 * Verifies a JWT and extracts the authenticated user's ID.
 *
 * Token verification is kept in one utility so authentication middleware can
 * consistently validate tokens without duplicating JWT implementation details.
 *
 * @param token - JWT received from an Authorization header.
 * @returns The user ID stored in the verified token.
 * @throws Error when the token is invalid, expired, or missing the user ID.
 */
export function verifyToken(token: string): string {
  const payload = jwt.verify(token, getJwtSecret());

  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.userId !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return payload.userId;
}
