export type HabitColor = 
  | 'pink'
  | 'amber'
  | 'blue'
  | 'emerald'
  | 'purple'
  | 'rose'
  | 'cyan'
  | 'orange';

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: HabitColor;
  completedDates: string[]; // YYYY-MM-DD
  createdAt: string; // YYYY-MM-DD
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate30Days: number;
  completedToday: boolean;
}

export interface ColorPalette {
  id: HabitColor;
  name: string;
  activeBg: string;
  activeDot: string;
  inactiveDot: string;
  todayRing: string;
  text: string;
  border: string;
  glow: string;
  hex: string;
}
