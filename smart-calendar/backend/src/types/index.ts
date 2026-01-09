// Tipos globais da aplicação

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
