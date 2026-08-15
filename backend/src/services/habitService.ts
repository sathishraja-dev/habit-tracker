import { HabitLog, type HabitType } from "../models/HabitLog.js";
import mongoose from "mongoose";
import { User } from "../models/User.js";

interface LogHabitInput {
  userId: string;
  habitType: HabitType;
  date: string;
  value: number;
}

/**
 * Creates or updates a user's habit log for the selected calendar date.
 *
 * The authenticated user ID comes from the JWT, while the date and habit
 * values come from the validated request body.
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

  const log = await HabitLog.findOneAndUpdate(
    {
      userId: userObjectId,
      habitType: input.habitType,
      date: input.date,
    },
    {
      userId: userObjectId,
      habitType: input.habitType,
      date: input.date,
      value: input.value,
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    },
  );

  return log;
}
