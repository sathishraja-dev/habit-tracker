import type { DashboardHabit } from "../types/dashboard";

interface HabitCardProps {
  habit: DashboardHabit;
}

/**
 * Displays the progress and streak information for one habit.
 *
 * The component receives a DashboardHabit through props so the same
 * component can render water, sleep, and exercise without duplicating UI.
 */
function HabitCard({ habit }: HabitCardProps) {
  const { habitType, currentStreak, weeklyProgress } = habit;

  const habitName = habitType.charAt(0).toUpperCase() + habitType.slice(1);

  const progressWidth = `${weeklyProgress.percentage}%`;

  return (
    <article className="habit-card">
      <div className="habit-card-header">
        <div>
          <p className="habit-card-label">Habit</p>
          <h2>{habitName}</h2>
        </div>

        <strong>{weeklyProgress.percentage}%</strong>
      </div>

      <div className="progress-track">
        <div
          className="progress-value"
          style={{ width: progressWidth }}
          aria-label={`${weeklyProgress.percentage}% complete`}
        />
      </div>

      <div className="habit-card-footer">
        <span>
          {weeklyProgress.completedDays} / {weeklyProgress.totalDays} days
        </span>

        <span>🔥 {currentStreak} day streak</span>
      </div>
    </article>
  );
}

export default HabitCard;
