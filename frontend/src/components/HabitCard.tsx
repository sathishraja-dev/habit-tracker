import type { DashboardHabit } from "../types/dashboard";

interface HabitCardProps {
  habit: DashboardHabit;
}

/**
 * Displays the progress, streak, and recent log values for one habit.
 *
 * The component is reusable for every supported habit type because
 * all habit-specific information comes from the DashboardHabit prop.
 */
function HabitCard({ habit }: HabitCardProps) {
  const { habitType, currentStreak, weeklyProgress, logs } = habit;

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

      {logs.length > 0 && (
        <div className="recent-logs">
          <h3>Recent activity</h3>

          <ul>
            {logs.slice(0, 3).map((log) => (
              <li key={log.date}>
                <span>{log.date}</span>

                <strong>{log.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export default HabitCard;
