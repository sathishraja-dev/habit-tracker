import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectToDatabase } from "./db.js";
import { User } from "./models/User.js";
import { HabitLog, type HabitType } from "./models/HabitLog.js";

/**
 * Creates deterministic demo data for local development.
 *
 * The seed script gives developers a known starting dataset so the dashboard
 * can be tested without manually creating habit logs.
 */
async function seed(): Promise<void> {
  await connectToDatabase();

  // Remove previous demo data so running the seed repeatedly stays predictable.
  await HabitLog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("DemoPassword123!", 12);

  const user = await User.create({
    name: "Demo User",
    email: "demo@example.com",
    passwordHash,
  });

  const logs: Array<{
    userId: mongoose.Types.ObjectId;
    habitType: HabitType;
    date: string;
    value: number;
  }> = [
    {
      userId: user._id,
      habitType: "water",
      date: "2026-08-08",
      value: 2.5,
    },
    {
      userId: user._id,
      habitType: "water",
      date: "2026-08-09",
      value: 3,
    },
    {
      userId: user._id,
      habitType: "water",
      date: "2026-08-10",
      value: 2.2,
    },
    {
      userId: user._id,
      habitType: "water",
      date: "2026-08-11",
      value: 2.8,
    },
    {
      userId: user._id,
      habitType: "water",
      date: "2026-08-12",
      value: 2.5,
    },
    {
      userId: user._id,
      habitType: "water",
      date: "2026-08-13",
      value: 3,
    },
    {
      userId: user._id,
      habitType: "exercise",
      date: "2026-08-08",
      value: 30,
    },
    {
      userId: user._id,
      habitType: "exercise",
      date: "2026-08-10",
      value: 45,
    },
    {
      userId: user._id,
      habitType: "exercise",
      date: "2026-08-12",
      value: 40,
    },
    {
      userId: user._id,
      habitType: "exercise",
      date: "2026-08-13",
      value: 35,
    },
    {
      userId: user._id,
      habitType: "sleep",
      date: "2026-08-08",
      value: 7.5,
    },
    {
      userId: user._id,
      habitType: "sleep",
      date: "2026-08-09",
      value: 8,
    },
    {
      userId: user._id,
      habitType: "sleep",
      date: "2026-08-10",
      value: 7,
    },
    {
      userId: user._id,
      habitType: "sleep",
      date: "2026-08-11",
      value: 7.5,
    },
    {
      userId: user._id,
      habitType: "sleep",
      date: "2026-08-12",
      value: 8,
    },
    {
      userId: user._id,
      habitType: "sleep",
      date: "2026-08-13",
      value: 7,
    },
  ];

  await HabitLog.insertMany(logs);

  console.log("Seed completed successfully");
  console.log(`Demo user ID: ${user._id}`);
  console.log("Demo user email: demo@example.com");
  console.log("Demo user password: DemoPassword123!");

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Seed failed", error);
  await mongoose.disconnect();
  process.exit(1);
});
