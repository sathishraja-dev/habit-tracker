import express from "express";
import cors from "cors";

/**
 * Creates and configures the Express application.
 *
 * Keeping app creation separate from server startup makes the application
 * easier to test because tests can import the app without opening a port.
 */

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  return app;
}
