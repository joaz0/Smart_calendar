// smart-calendar/backend/src/types/dto.ts

export interface AuthenticatedRequest {
  user?: {
    id: number;
    email: string;
    name: string;
  };
  headers: any;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface Event {
  id: number;
  userId: number;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  categoryId?: number;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
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
  recurrence_end_date?: string;
  recurrence_occurrences?: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  timezone?: string;
  createdAt: Date;
  updatedAt: Date;
}
