import { Entity } from './common-interfaces';
import { Recurrence } from './recurrence.model';
import { Category } from './category.model';
import { Reminder } from './notification.model';

export interface CalendarEvent extends Entity {
  title: string;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  allDay?: boolean;
  location?: string;
  url?: string;
  color?: string;
  recurrence?: Recurrence;
  category?: Category;
  reminders?: Reminder[];
  participants?: string[];
  createdBy?: string;
  updatedBy?: string;
}

// Alias para compatibilidade com importações antigas
export type Event = CalendarEvent;
