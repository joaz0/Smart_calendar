// shared/types/dto.ts

/**
 * Representa a estrutura de um usuário no sistema.
 */
export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  theme?: 'light' | 'dark';
  language?: string;
  timezone?: string;
  calendar_view?: 'day' | 'week' | 'month';
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  share_calendar?: boolean;
  share_availability?: boolean;
  show_real_names?: boolean;
  allow_data_collection?: boolean;
  allow_ai_features?: boolean;
  preferences?: any; // ou um tipo mais específico se o JSONB tiver uma estrutura definida
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

/**
 * Representa a estrutura de um evento no calendário.
 */
export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_time: string; // ISO 8601 date string
  end_time?: string; // ISO 8601 date string
  is_all_day?: boolean;
  location?: string;
  url?: string;
  color?: string;
  category_id?: number;
  user_id: number;
  recurrence_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrence_interval?: number;
  recurrence_days_of_week?: number[];
  recurrence_day_of_month?: number;
  recurrence_month_of_year?: number;
  recurrence_end_date?: string; // ISO 8601 date string
  recurrence_occurrences?: number;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

/**
 * Representa a estrutura de uma tarefa.
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string; // ISO 8601 date string
  userId: number;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}
