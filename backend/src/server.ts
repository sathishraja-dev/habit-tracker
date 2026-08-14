import "dotenv/config";
import { createApp } from "./app";
import { connectToDatabase } from "./db.js";

const app = createApp();
const port = process.env.PORT ?? 3000;
/**
 * Starts the HTTP server.
 *
 * The server entry point is kept separate from the Express app so the
 * application can be imported independently by tests.
 */
async function startServer(): Promise<void> {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Habit Tracker API running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
