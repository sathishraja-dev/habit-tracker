import mongoose from "mongoose";
/**
 * Connects the application to MongoDB.
 *
 * Keeping database connection logic in one place prevents connection
 * configuration from being scattered throughout the application.
 */

export async function connectToDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not configured");
  }

  await mongoose.connect(mongoUri);

  console.log("Connected to MongoDB");
}
