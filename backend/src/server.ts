import { createApp } from "./app";

const app = createApp();
const port = process.env.PORT ?? 3000;
/**
 * Starts the HTTP server.
 *
 * The server entry point is kept separate from the Express app so the
 * application can be imported independently by tests.
 */
app.listen(port, () => {
  console.log(`Habit Tracker API running on port ${port}`);
});
