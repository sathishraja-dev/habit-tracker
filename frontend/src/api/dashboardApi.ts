import type { DashboardResponse } from "../types/dashboard";

const API_BASE_URL = "http://localhost:3000";

/**
 * Fetches the authenticated user's dashboard.
 *
 * The backend identifies the user from the JWT rather than from a
 * client-supplied user ID.
 */
export async function fetchDashboard(
  token: string,
): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return response.json() as Promise<DashboardResponse>;
}
