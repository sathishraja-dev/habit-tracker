import type { HabitType } from "../types/dashboard";

const API_BASE_URL = "http://localhost:3000";

export interface CreateHabitLogRequest {
  habitType: HabitType;
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
 * Sends a habit log for the authenticated user.
 *
 * User identity is established by the JWT rather than request-body data.
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
