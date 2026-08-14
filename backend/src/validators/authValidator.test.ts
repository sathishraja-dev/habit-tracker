import { describe, expect, it } from "vitest";
import { signupSchema } from "./authValidator.js";

describe("signupSchema", () => {
  it("accepts valid signup data", () => {
    const result = signupSchema.safeParse({
      name: "Sathish",
      email: "Sathish@Example.com",
      password: "StrongPassword123!",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("sathish@example.com");
    }
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({
      name: "Sathish",
      email: "not-an-email",
      password: "StrongPassword123!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than eight characters", () => {
    const result = signupSchema.safeParse({
      name: "Sathish",
      email: "sathish@example.com",
      password: "1234567",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty name", () => {
    const result = signupSchema.safeParse({
      name: "",
      email: "sathish@example.com",
      password: "StrongPassword123!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password longer than 128 characters", () => {
    const result = signupSchema.safeParse({
      name: "Sathish",
      email: "sathish@example.com",
      password: "a".repeat(129),
    });

    expect(result.success).toBe(false);
  });
});
