import { describe, expect, it } from "vitest";
import { comparePassword, hashPassword } from "./password.js";

describe("password utilities", () => {
  it("hashes a password without storing the original value", async () => {
    const password = "DemoPassword123!";

    const passwordHash = await hashPassword(password);

    expect(passwordHash).not.toBe(password);
    expect(passwordHash).toMatch(/^\$2[aby]\$/);
  });

  it("successfully compares the correct password", async () => {
    const password = "DemoPassword123!";
    const passwordHash = await hashPassword(password);

    const isValid = await comparePassword(password, passwordHash);

    expect(isValid).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const passwordHash = await hashPassword("DemoPassword123!");

    const isValid = await comparePassword("WrongPassword123!", passwordHash);

    expect(isValid).toBe(false);
  });
});
