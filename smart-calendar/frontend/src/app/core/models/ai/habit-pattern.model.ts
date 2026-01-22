export interface HabitPattern {
  id?: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  preferredTime?: string; // e.g. '08:00'
  durationMinutes?: number;
  tags?: string[];
}

export default HabitPattern;
