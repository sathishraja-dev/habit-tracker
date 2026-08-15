import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { fetchDashboard } from "./api/dashboardApi";
import { login, signup } from "./api/authApi";
import HabitCard from "./components/HabitCard";
import HabitLogForm from "./components/HabitLogForm";
import type { DashboardData } from "./types/dashboard";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import LoadingState from "./components/LoadingState";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface Session {
  token: string;
  user: AuthUser;
}

/**
 * Root component for the Habit Tracker application.
 *
 * The application keeps the authenticated session in React state and uses
 * the JWT for protected API requests. The backend remains responsible for
 * determining which user owns the requested data.
 */
function App() {
  const [session, setSession] = useState<Session | null>(() => {
    const storedToken = localStorage.getItem("habit_tracker_token");
    const storedUser = localStorage.getItem("habit_tracker_user");

    if (!storedToken || !storedUser) {
      return null;
    }

    try {
      return {
        token: storedToken,
        user: JSON.parse(storedUser) as AuthUser,
      };
    } catch {
      localStorage.removeItem("habit_tracker_token");
      localStorage.removeItem("habit_tracker_user");

      return null;
    }
  });

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [authError, setAuthError] = useState<string | null>(null);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /**
   * Stores the authenticated session locally so the user remains logged in
   * when the page is refreshed.
   */
  function saveSession(nextSession: Session) {
    localStorage.setItem("habit_tracker_token", nextSession.token);
    localStorage.setItem(
      "habit_tracker_user",
      JSON.stringify(nextSession.user),
    );

    setSession(nextSession);
  }

  /**
   * Removes the authenticated session and returns the application to
   * the login screen.
   */
  function logout() {
    localStorage.removeItem("habit_tracker_token");
    localStorage.removeItem("habit_tracker_user");

    setSession(null);
    setDashboard(null);
  }

  /**
   * Loads dashboard data for the authenticated user.
   *
   * The JWT identifies the user. No user ID is sent by the frontend.
   */
  const loadDashboard = useCallback(async () => {
    if (!session) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchDashboard(session.token);

      if (!response.success) {
        throw new Error("Dashboard request was unsuccessful");
      }

      setDashboard(response.data);
    } catch (requestError) {
      console.error("Failed to load dashboard", requestError);

      if (
        requestError instanceof Error &&
        requestError.message.includes("Failed to fetch dashboard")
      ) {
        setError("Unable to load your dashboard.");
      } else {
        setError("Your session may have expired. Please log in again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      void loadDashboard();
    }
  }, [session, loadDashboard]);

  /**
   * Handles login and signup form submission.
   */
  async function handleAuthentication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setAuthError(null);
    setIsAuthenticating(true);

    try {
      const response = isSignup
        ? await signup(name, email, password)
        : await login(email, password);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message ?? "Authentication failed");
      }

      saveSession({
        token: response.data.token,
        user: response.data.user,
      });

      setPassword("");
      setName("");
    } catch (authenticationError) {
      console.error("Authentication failed", authenticationError);

      setAuthError(
        authenticationError instanceof Error
          ? authenticationError.message
          : "Authentication failed",
      );
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (!session) {
    return (
      <main className="app">
        <header className="app-header">
          <div>
            <p className="app-eyebrow">Habit Tracker</p>

            <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>

            <p className="app-description">
              {isSignup
                ? "Create an account to start tracking your habits."
                : "Log in to view your personal habit dashboard."}
            </p>
          </div>
        </header>

        <section className="log-form">
          <form onSubmit={handleAuthentication}>
            {isSignup && (
              <label>
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={100}
                  autoComplete="name"
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
            </label>

            {authError && <p className="form-error">{authError}</p>}

            <button type="submit" disabled={isAuthenticating}>
              {isAuthenticating
                ? "Please wait..."
                : isSignup
                  ? "Create Account"
                  : "Log In"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsSignup((current) => !current);
              setAuthError(null);
            }}
          >
            {isSignup
              ? "Already have an account? Log in"
              : "Don't have an account? Sign up"}
          </button>
        </section>
      </main>
    );
  }

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

        <button type="button" onClick={logout}>
          Log Out
        </button>
      </header>

      {isLoading && <LoadingState message="Loading your habits..." />}

      {error && <ErrorState message={error} onRetry={loadDashboard} />}

      {dashboard && !isLoading && !error && (
        <>
          <section>
            <div className="dashboard-intro">
              <h2>Welcome, {dashboard.user.name}</h2>

              <p>You are tracking {dashboard.habits.length} habits.</p>
            </div>

            {dashboard.habits.length === 0 ? (
              <EmptyState
                title="No habits yet"
                message="Start by logging your first habit."
              />
            ) : (
              <div className="habit-grid">
                {dashboard.habits.map((habit) => (
                  <HabitCard key={habit.habitType} habit={habit} />
                ))}
              </div>
            )}
          </section>

          <HabitLogForm token={session.token} onLogCreated={loadDashboard} />
        </>
      )}
    </main>
  );
}

export default App;
