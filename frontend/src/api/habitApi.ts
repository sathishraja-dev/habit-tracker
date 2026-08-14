import type { HabitType } from "../types/dashboard";

const API_BASE_URL = "http://localhost:3000";

export interface CreateHabitLogRequest {
  userId: string;
  habitType: HabitType;
  date: string;
  value: number;
}

export interface CreateHabitLogResponse {
  success: boolean;
  data?: {
    id: string;
    habitType: HabitType;
    date: string;
    value: number;
  };
  error?: string;
}

/**
 * Sends a new habit log to the backend.
 *
 * The API client owns the HTTP request so UI components only need to
 * provide the habit data and don't need to know the backend URL or
 * request configuration.
 */
export async function createHabitLog(
  log: CreateHabitLogRequest,
): Promise<CreateHabitLogResponse> {
  const response = await fetch(`${API_BASE_URL}/api/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(log),
  });

  const result = (await response.json()) as CreateHabitLogResponse;

  if (!response.ok) {
    throw new Error(result.error ?? "Failed to create habit log");
  }

  return result;
}
