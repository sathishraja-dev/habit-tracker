import { describe, expect, it } from "vitest";
import { loginSchema } from "./authLoginValidator";

describe("loginSchema", () => {
  it("accepts valid login credentials", () => {
    const result = loginSchema.safeParse({
      email: "Sathish@Example.com",
      password: "StrongPassword123!",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("sathish@example.com");
    }
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "StrongPassword123!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "sathish@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an excessively long password", () => {
    const result = loginSchema.safeParse({
      email: "sathish@example.com",
      password: "a".repeat(129),
    });

    expect(result.success).toBe(false);
  });
});
