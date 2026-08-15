const API_BASE_URL = "http://localhost:3000";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: AuthUser;
    token: string;
  };
  error?: {
    message: string;
  };
}

/**
 * Registers a new user account.
 */
export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const result = (await response.json()) as AuthResponse;

  if (!response.ok) {
    throw new Error(result.error?.message ?? "Signup failed");
  }

  return result;
}

/**
 * Authenticates an existing user and returns a JWT.
 */
export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = (await response.json()) as AuthResponse;

  if (!response.ok) {
    throw new Error(result.error?.message ?? "Login failed");
  }

  return result;
}
