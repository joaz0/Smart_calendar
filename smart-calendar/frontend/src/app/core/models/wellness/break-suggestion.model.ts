export interface BreakSuggestion {
  id: string;
  userId: string;
  type: 'short' | 'medium' | 'long';
  duration: number; // minutes
  suggestedTime: Date;
  reason: string;
  activities: string[];
  priority: 'low' | 'medium' | 'high';
  accepted?: boolean;
  completedAt?: Date;
}

export interface BreakSchedule {
  userId: string;
  enabled: boolean;
  interval: number; // minutes between breaks
  duration: number; // minutes per break
  autoSchedule: boolean;
  workingHours: { start: string; end: string };
}
