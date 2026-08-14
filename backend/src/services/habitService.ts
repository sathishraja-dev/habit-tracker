import { HabitLog, type HabitType } from "../models/HabitLog";
import mongoose from "mongoose";
import { User } from "../models/User.js";

interface LogHabitInput {
  userId: string;
  habitType: HabitType;
  value: number;
}

/**
 * Creates or updates a user's habit log for today.
 *
 * The service validates the referenced user before writing the habit log,
 * ensuring that every habit record belongs to an existing user.
 */
export async function logHabit(input: LogHabitInput) {
  const userObjectId = new mongoose.Types.ObjectId(input.userId);

  const userExists = await User.exists({
    _id: userObjectId,
  });

  if (!userExists) {
    const error = new Error("User not found");
    error.name = "UserNotFoundError";
    throw error;
  }

  const today = new Date().toISOString().slice(0, 10);

  const log = await HabitLog.findOneAndUpdate(
    {
      userId: userObjectId,
      habitType: input.habitType,
      date: today,
    },
    {
      userId: userObjectId,
      habitType: input.habitType,
      date: today,
      value: input.value,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );

  return log;
}
