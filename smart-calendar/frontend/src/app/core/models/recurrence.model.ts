export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Recurrence {
  frequency: RecurrenceFrequency;
  interval?: number; // Ex: a cada 2 semanas
  daysOfWeek?: number[]; // 0 = domingo, 1 = segunda, etc.
  dayOfMonth?: number; // 1-31
  monthOfYear?: number; // 1-12
  endDate?: Date;
  occurrences?: number;
}
