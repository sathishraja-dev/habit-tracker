import type { DashboardResponse } from "../types/dashboard";

const API_BASE_URL = "http://localhost:3000";

/**
 * Fetches the authenticated user's dashboard.
 *
 * The JWT is sent in the Authorization header. The backend extracts
 * the user ID from the verified token, so the frontend does not
 * send a user ID.
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
