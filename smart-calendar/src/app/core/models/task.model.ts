// src/app/core/models/task.model.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
  completed: boolean; // Não opcional - sempre tem valor
  created_at?: string;
  updated_at?: string;
}