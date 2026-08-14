import { HabitLog, HABIT_TYPES, type HabitType } from "../models/HabitLog.js";
import { User } from "../models/User.js";

interface DashboardHabit {
  habitType: HabitType;
  currentStreak: number;
  weeklyProgress: {
    completedDays: number;
    totalDays: number;
    percentage: number;
  };
  logs: Array<{
    date: string;
    value: number;
  }>;
}

interface DashboardData {
  user: {
    id: string;
    name: string;
  };
  habits: DashboardHabit[];
}

/**
 * Returns the dashboard data for a user.
 *
 * The service owns progress calculations so the controller only needs to
 * handle HTTP concerns.
 */
export async function getDashboard(
  userId: string,
): Promise<DashboardData | null> {
  const user = await User.findById(userId).lean();

  if (!user) {
    return null;
  }

  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 6);

  const startDateString = formatDate(startDate);
  const endDateString = formatDate(today);

  const logs = await HabitLog.find({
    userId: user._id,
    date: {
      $gte: startDateString,
      $lte: endDateString,
    },
  })
    .sort({ date: -1 })
    .lean();

  const habits = HABIT_TYPES.map((habitType) => {
    const habitLogs = logs.filter((log) => log.habitType === habitType);

    const loggedDates = new Set(habitLogs.map((log) => log.date));

    const completedDays = habitLogs.length;

    const percentage = Math.round((completedDays / 7) * 100);

    return {
      habitType,
      currentStreak: calculateCurrentStreak(loggedDates, today),
      weeklyProgress: {
        completedDays,
        totalDays: 7,
        percentage,
      },
      logs: habitLogs.map((log) => ({
        date: log.date,
        value: log.value,
      })),
    };
  });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
    },
    habits,
  };
}

/**
 * Calculates the number of consecutive logged days ending at today or the
 * most recent logged day.
 */
function calculateCurrentStreak(loggedDates: Set<string>, today: Date): number {
  let streak = 0;

  const cursor = new Date(today);

  const todayString = formatDate(cursor);

  if (!loggedDates.has(todayString)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (loggedDates.has(formatDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/**
 * Converts a Date into the application's calendar-date format.
 *
 * Keeping date formatting in one function prevents different parts of the
 * dashboard logic from producing inconsistent date strings.
 */
function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
