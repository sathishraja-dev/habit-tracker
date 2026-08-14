import mongoose, { Document, Schema } from "mongoose";

/**
 * Defines the supported health habits in the application.
 *
 * Keeping the allowed habit types in one place prevents inconsistent values
 * such as "water", "Water", and "WATER" from being stored separately.
 */

export const HABIT_TYPES = ["sleep", "exercise", "water"] as const;

export type HabitType = (typeof HABIT_TYPES)[number];

export interface IHabitLog extends Document {
  userID: mongoose.Types.ObjectId;
  habitType: HabitType;
  date: string;
  value: number;
}

const habitLogSchema = new Schema<IHabitLog>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    habitType: {
      type: String,
      enum: HABIT_TYPES,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Prevents a user from accidentally creating multiple logs for the same
 * habit on the same calendar day.
 *
 * The database constraint is important because application-level checks
 * alone can still allow duplicates when two requests arrive concurrently.
 */

habitLogSchema.index(
  {
    userId: 1,
    habitType: 1,
    date: 1,
  },
  {
    unique: true,
  },
);

export const HabitLog = mongoose.model<IHabitLog>("HabitLog", habitLogSchema);
