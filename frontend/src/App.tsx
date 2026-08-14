import { useEffect, useState } from "react";
import "./App.css";
import { fetchDashboard } from "./api/dashboardApi";
import type { DashboardData } from "./types/dashboard";

const DEMO_USER_ID = "6a7eaf664cef4e31024fd090";

/**
 * Root component for the Habit Tracker dashboard.
 *
 * The component loads dashboard data from the backend when it mounts
 * and keeps the API state separate from the presentation logic.
 */
function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Loads dashboard data for the configured demo user.
     *
     * Keeping the asynchronous operation inside this function makes the
     * effect responsible only for triggering the initial data request.
     */
    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchDashboard(DEMO_USER_ID);

        if (!response.success) {
          throw new Error("Dashboard request was unsuccessful");
        }

        setDashboard(response.data);
      } catch (requestError) {
        console.error("Failed to load dashboard", requestError);

        setError("Unable to load your dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Habit Tracker</p>
          <h1>Your Dashboard</h1>
          <p className="app-description">
            Track your habits, progress, and current streaks.
          </p>
        </div>
      </header>

      {isLoading && (
        <section className="dashboard-placeholder">
          <p>Loading your habits...</p>
        </section>
      )}

      {error && (
        <section className="dashboard-placeholder">
          <p>{error}</p>
        </section>
      )}

      {dashboard && !isLoading && !error && (
        <section className="dashboard-placeholder">
          <h2>Welcome, {dashboard.user.name}</h2>

          <p>You are tracking {dashboard.habits.length} habits.</p>
        </section>
      )}
    </main>
  );
}

export default App;
