export type HabitType = "sleep" | "exercise" | "water";

export interface HabitLogSummary {
  date: string;
  value: number;
}

export interface WeeklyProgress {
  completedDays: number;
  totalDays: number;
  percentage: number;
}

export interface DashboardHabit {
  habitType: HabitType;
  currentStreak: number;
  weeklyProgress: WeeklyProgress;
  logs: HabitLogSummary[];
}

export interface DashboardUser {
  id: string;
  name: string;
}

export interface DashboardData {
  user: DashboardUser;
  habits: DashboardHabit[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}
