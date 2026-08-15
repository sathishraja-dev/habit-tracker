import type { HabitType } from "../types/dashboard";

const API_BASE_URL = "http://localhost:3000";

export interface CreateHabitLogRequest {
  habitType: HabitType;
  date: string;
  value: number;
}

export interface CreateHabitLogResponse {
  success: boolean;
  log?: {
    id: string;
    habitType: HabitType;
    date: string;
    value: number;
  };
  error?: string;
}

/**
 * Sends a habit log for the authenticated user.
 *
 * The backend gets the user ID from the JWT.
 */
export async function createHabitLog(
  token: string,
  log: CreateHabitLogRequest,
): Promise<CreateHabitLogResponse> {
  const response = await fetch(`${API_BASE_URL}/api/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(log),
  });

  const result = (await response.json()) as CreateHabitLogResponse;

  if (!response.ok) {
    throw new Error(result.error ?? "Failed to create habit log");
  }

  return result;
}
