Interfaces comuns obrigatórias:

// models/calendar-event.model.ts
export interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  location?: string;
  color?: string;
  category?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// models/task.model.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
