import { describe, expect, it, beforeEach } from "vitest";
import { generateToken, verifyToken } from "./jwt.js";

describe("JWT utilities", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret-that-is-only-used-by-unit-tests";
  });

  it("generates a token containing the user ID", () => {
    const token = generateToken("user-123");

    expect(token).toEqual(expect.any(String));
    expect(token.split(".")).toHaveLength(3);
  });

  it("verifies a valid token and returns the user ID", () => {
    const token = generateToken("user-123");

    const userId = verifyToken(token);

    expect(userId).toBe("user-123");
  });

  it("rejects an invalid token", () => {
    expect(() => verifyToken("invalid-token")).toThrow();
  });

  it("rejects a token signed with a different secret", async () => {
    const token = generateToken("user-123");

    process.env.JWT_SECRET = "different-secret";

    expect(() => verifyToken(token)).toThrow();
  });
});
