export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  archived: boolean;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // ISO date string YYYY-MM-DD
  completed: boolean;
}

export interface DailyProgress {
  date: string;
  completedHabits: string[];
  totalHabits: number;
  completionRate: number;
}

export interface YearlyData {
  year: number;
  habits: Habit[];
  completions: HabitCompletion[];
}

export type ViewMode = 'day' | 'week' | 'month' | 'year';

export interface CalendarDay {
  date: string;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  completionRate: number;
  completedHabits: number;
  totalHabits: number;
}
