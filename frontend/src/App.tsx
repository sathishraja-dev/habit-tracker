import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { fetchDashboard } from "./api/dashboardApi";
import HabitCard from "./components/HabitCard";
import HabitLogForm from "./components/HabitLogForm";
import type { DashboardData } from "./types/dashboard";

const DEMO_USER_ID = "6a7eaf664cef4e31024fd090";

/**
 * Root component for the Habit Tracker dashboard.
 *
 * It coordinates dashboard loading and passes the resulting data
 * to reusable child components.
 */
function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /**
   * Loads the latest dashboard data from the backend.
   *
   * This function is memoized so it can safely be used by both the
   * initial effect and the habit logging form.
   */
  const loadDashboard = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

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
        <>
          <section>
            <div className="dashboard-intro">
              <h2>Welcome, {dashboard.user.name}</h2>

              <p>You are tracking {dashboard.habits.length} habits.</p>
            </div>

            <div className="habit-grid">
              {dashboard.habits.map((habit) => (
                <HabitCard key={habit.habitType} habit={habit} />
              ))}
            </div>
          </section>

          <HabitLogForm userId={DEMO_USER_ID} onLogCreated={loadDashboard} />
        </>
      )}
    </main>
  );
}

export default App;
