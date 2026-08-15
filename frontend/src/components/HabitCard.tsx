import type { DashboardHabit } from "../types/dashboard";
import { HABIT_CONFIG } from "../types/habitConfig";

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

  const habitConfig = HABIT_CONFIG[habitType];

  const progressWidth = `${weeklyProgress.percentage}%`;

  return (
    <article className="habit-card">
      <div className="habit-card-header">
        <div>
          <p className="habit-card-label">Habit</p>

          <h2>{habitConfig.label}</h2>
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
            {logs.map((log) => (
              <li key={log.date}>
                <span>{log.date}</span>

                <strong>
                  {log.value} {habitConfig.unit}
                </strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export default HabitCard;
