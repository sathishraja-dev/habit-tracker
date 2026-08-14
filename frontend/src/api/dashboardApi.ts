import type { DashboardResponse } from "../types/dashboard";

const API_BASE_URL = "http://localhost:3000";

/**
 * Fetches dashboard data for a user from the backend API.
 *
 * Keeping HTTP communication in a dedicated API module prevents React
 * components from becoming responsible for networking details.
 */
export async function fetchDashboard(
  userId: string,
): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return response.json() as Promise<DashboardResponse>;
}
