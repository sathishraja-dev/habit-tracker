import { User } from "../models/User.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Authenticates a user using their email and password.
 *
 * The service deliberately returns the same authentication error when the
 * email does not exist or the password is incorrect. This prevents callers
 * from using the login endpoint to discover which email addresses are
 * registered in the application.
 *
 * @param input - Validated login credentials.
 * @returns The authenticated user's safe profile and JWT.
 * @throws Error when the credentials are invalid.
 */
export async function login(input: LoginInput) {
  const user = await User.findOne({
    email: input.email,
  }).select("+passwordHash");

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await comparePassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    token,
  };
}
