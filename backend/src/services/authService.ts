import { User } from "../models/User.js";
import { hashPassword } from "../utils/password.js";

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Creates a new user account from already-validated signup data.
 *
 * The service owns the authentication business logic: checking whether the
 * email is already registered, hashing the password, and creating the user.
 * HTTP request and response handling stays inside the controller layer.
 *
 * @param input - Validated name, email, and plain-text password.
 * @returns The newly created user without exposing the password hash.
 * @throws Error when the email is already registered.
 */
export async function signup(input: SignupInput) {
  const existingUser = await User.findOne({
    email: input.email,
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}
