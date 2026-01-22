import { Recurrence } from './recurrence.model';
import { Category } from './category.model';
import { Reminder } from './notification.model';

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  allDay: boolean;
  location?: string;
  url?: string;
  color?: string;
  recurrence?: Recurrence;
  category?: Category;
  reminders?: Reminder[];
  participants?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Alias para compatibilidade com imports antigos
export type CalendarEvent = Event;
