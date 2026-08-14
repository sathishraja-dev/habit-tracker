import type { HabitType } from "./dashboard";

export interface HabitConfig {
  label: string;
  unit: string;
}

/**
 * Defines presentation information for each supported habit.
 *
 * Keeping this configuration in one place prevents habit-specific
 * labels and units from being duplicated across components.
 */
export const HABIT_CONFIG: Record<HabitType, HabitConfig> = {
  water: {
    label: "Water",
    unit: "L",
  },
  sleep: {
    label: "Sleep",
    unit: "hrs",
  },
  exercise: {
    label: "Exercise",
    unit: "min",
  },
};
