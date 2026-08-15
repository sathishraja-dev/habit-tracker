import { z } from "zod";
import { HABIT_TYPES } from "../models/HabitLog.js";

/**
 * Validates the request body used to create or update a daily habit log.
 *
 * Validation is performed at the API boundary so invalid requests are
 * rejected before they reach the controller, service, or database layer.
 */
export const createHabitLogSchema = z
  .object({
    habitType: z.enum(HABIT_TYPES),

    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),

    value: z.number().nonnegative("Value cannot be negative"),
  })
  .strict();
