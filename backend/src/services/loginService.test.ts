import { beforeEach, describe, expect, it, vi } from "vitest";
import { login } from "./loginService.js";
import { User } from "../models/User.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

vi.mock("../models/User.js", () => ({
  User: {
    findOne: vi.fn(),
  },
}));

vi.mock("../utils/password.js", () => ({
  comparePassword: vi.fn(),
}));

vi.mock("../utils/jwt.js", () => ({
  generateToken: vi.fn(),
}));

describe("loginService.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("authenticates a user and returns a JWT", async () => {
    vi.mocked(User.findOne).mockReturnValue({
      select: vi.fn().mockResolvedValue({
        _id: "user-123",
        name: "Sathish",
        email: "sathish@example.com",
        passwordHash: "stored-hash",
      }),
    } as never);

    vi.mocked(comparePassword).mockResolvedValue(true);
    vi.mocked(generateToken).mockReturnValue("jwt-token");

    const result = await login({
      email: "sathish@example.com",
      password: "StrongPassword123!",
    });

    expect(User.findOne).toHaveBeenCalledWith({
      email: "sathish@example.com",
    });

    expect(comparePassword).toHaveBeenCalledWith(
      "StrongPassword123!",
      "stored-hash",
    );

    expect(generateToken).toHaveBeenCalledWith("user-123");

    expect(result).toEqual({
      user: {
        id: "user-123",
        name: "Sathish",
        email: "sathish@example.com",
      },
      token: "jwt-token",
    });
  });

  it("rejects an unknown email", async () => {
    vi.mocked(User.findOne).mockReturnValue({
      select: vi.fn().mockResolvedValue(null),
    } as never);

    await expect(
      login({
        email: "unknown@example.com",
        password: "StrongPassword123!",
      }),
    ).rejects.toThrow("INVALID_CREDENTIALS");

    expect(comparePassword).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
  });

  it("rejects an incorrect password", async () => {
    vi.mocked(User.findOne).mockReturnValue({
      select: vi.fn().mockResolvedValue({
        _id: "user-123",
        name: "Sathish",
        email: "sathish@example.com",
        passwordHash: "stored-hash",
      }),
    } as never);

    vi.mocked(comparePassword).mockResolvedValue(false);

    await expect(
      login({
        email: "sathish@example.com",
        password: "WrongPassword123!",
      }),
    ).rejects.toThrow("INVALID_CREDENTIALS");

    expect(generateToken).not.toHaveBeenCalled();
  });
});
