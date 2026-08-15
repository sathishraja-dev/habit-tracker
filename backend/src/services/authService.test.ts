import { beforeEach, describe, expect, it, vi } from "vitest";
import { signup } from "./authService.js";
import { User } from "../models/User.js";
import { hashPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

vi.mock("../models/User.js", () => ({
  User: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../utils/password.js", () => ({
  hashPassword: vi.fn(),
}));

vi.mock("../utils/jwt.js", () => ({
  generateToken: vi.fn(),
}));

describe("authService.signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    process.env.JWT_SECRET = "test-secret-that-is-only-used-by-unit-tests";
  });

  it("creates a user with a hashed password and JWT", async () => {
    vi.mocked(User.findOne).mockResolvedValue(null);

    vi.mocked(hashPassword).mockResolvedValue("hashed-password");

    vi.mocked(User.create).mockResolvedValue({
      _id: "user-123",
      name: "Sathish",
      email: "sathish@example.com",
      passwordHash: "hashed-password",
    } as never);

    vi.mocked(generateToken).mockReturnValue("test-jwt-token");

    const result = await signup({
      name: "Sathish",
      email: "sathish@example.com",
      password: "StrongPassword123!",
    });

    expect(hashPassword).toHaveBeenCalledWith("StrongPassword123!");

    expect(User.create).toHaveBeenCalledWith({
      name: "Sathish",
      email: "sathish@example.com",
      passwordHash: "hashed-password",
    });

    expect(generateToken).toHaveBeenCalledWith("user-123");

    expect(result).toEqual({
      user: {
        id: "user-123",
        name: "Sathish",
        email: "sathish@example.com",
      },
      token: "test-jwt-token",
    });
  });

  it("rejects an email that is already registered", async () => {
    vi.mocked(User.findOne).mockResolvedValue({
      _id: "existing-user",
      email: "sathish@example.com",
    } as never);

    await expect(
      signup({
        name: "Sathish",
        email: "sathish@example.com",
        password: "StrongPassword123!",
      }),
    ).rejects.toThrow("EMAIL_ALREADY_EXISTS");

    expect(hashPassword).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
  });
});
