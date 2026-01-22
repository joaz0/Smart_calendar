export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'health' | 'productivity' | 'learning' | 'personal' | 'other';
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays?: number[];
  goalCount?: number;
  reminderTime?: string;
  icon?: string;
  color?: string;
  createdAt: Date;
  streak: number;
  bestStreak: number;
  completions: HabitCompletion[];
  isActive: boolean;
}

export interface HabitCompletion {
  date: Date;
  completed: boolean;
  note?: string;
}

export interface HabitStats {
  totalCompletions: number;
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  last7Days: number;
  last30Days: number;
}
