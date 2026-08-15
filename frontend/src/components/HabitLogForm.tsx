import { useState } from "react";
import { createHabitLog } from "../api/habitApi";
import type { HabitType } from "../types/dashboard";
import { HABIT_CONFIG } from "../types/habitConfig";

interface HabitLogFormProps {
  token: string;
  onLogCreated: () => Promise<void>;
}
/**
 * Provides the UI for creating a new habit log.
 *
 * The component handles form state and user interaction while the API
 * module handles communication with the backend.
 */
function HabitLogForm({ token, onLogCreated }: HabitLogFormProps) {
  const [habitType, setHabitType] = useState<HabitType>("water");
  const selectedHabit = HABIT_CONFIG[habitType];

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [value, setValue] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission and sends the entered habit data
   * to the backend.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericValue = Number(value);

    if (!value || numericValue <= 0) {
      setError("Please enter a value greater than zero.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await createHabitLog(token, {
        habitType,
        date,
        value: numericValue,
      });

      setValue("");

      await onLogCreated();
    } catch (requestError) {
      console.error("Failed to create habit log", requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save habit log.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="log-form">
      <div>
        <p className="habit-card-label">Add Progress</p>
        <h2>Log a Habit</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Habit
          <select
            value={habitType}
            onChange={(event) => setHabitType(event.target.value as HabitType)}
          >
            <option value="water">Water</option>
            <option value="sleep">Sleep</option>
            <option value="exercise">Exercise</option>
          </select>
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>

        <label>
          Value ({selectedHabit.unit})
          <input
            type="number"
            min="0"
            step="0.1"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Enter value"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Log Habit"}
        </button>
      </form>
    </section>
  );
}

export default HabitLogForm;
