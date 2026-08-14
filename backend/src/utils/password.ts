import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hashes a user's plain-text password before it is stored in the database.
 *
 * Keeping password hashing inside a dedicated utility prevents authentication
 * controllers and services from duplicating bcrypt implementation details.
 *
 * @param password - The plain-text password supplied by the user.
 * @returns A bcrypt password hash that is safe to store in MongoDB.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain-text password with an existing bcrypt hash.
 *
 * This is used during login so the application can verify the password
 * without ever storing or retrieving the original plain-text password.
 *
 * @param password - The plain-text password supplied during login.
 * @param passwordHash - The bcrypt hash stored for the user.
 * @returns True when the supplied password matches the stored hash.
 */
export async function comparePassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
