import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { Task } from '../models/task.model';

interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
}

interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

interface TaskListResponse {
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private apiService: ApiService) {}

  /**
   * Obter todas as tarefas
   */
  getAllTasks(page = 1, limit = 50): Observable<TaskListResponse> {
    const params = {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<TaskListResponse>('/api/tasks', params).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao buscar tarefas');
      })
    );
  }

  /**
   * Obter tarefa por ID
   */
  getTaskById(id: number): Observable<Task> {
    return this.apiService.get<Task>(`/api/tasks/${id}`).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Tarefa não encontrada');
      })
    );
  }

  /**
   * Obter tarefas por status
   */
  getTasksByStatus(status: string, page = 1, limit = 50): Observable<TaskListResponse> {
    const params = {
      params: {
        status,
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<TaskListResponse>('/api/tasks', params).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao buscar tarefas');
      })
    );
  }

  /**
   * Criar nova tarefa
   */
  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.apiService.post<Task>('/api/tasks', task).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao criar tarefa');
      })
    );
  }

  /**
   * Atualizar tarefa
   */
  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.apiService.patch<Task>(`/api/tasks/${id}`, task).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao atualizar tarefa');
      })
    );
  }

  /**
   * Deletar tarefa
   */
  deleteTask(id: number): Observable<void> {
    return this.apiService.delete<void>(`/api/tasks/${id}`).pipe(
      map((response) => {
        if (response.success) {
          return undefined;
        }
        throw new Error(response.error || 'Erro ao deletar tarefa');
      })
    );
  }

  /**
   * Buscar tarefas por texto
   */
  searchTasks(query: string, page = 1, limit = 20): Observable<TaskListResponse> {
    const params = {
      params: {
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<TaskListResponse>('/api/tasks/search', params).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao buscar tarefas');
      })
    );
  }

  /**
   * Atualizar tarefas no subject
   */
  updateTasksSubject(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
  }

  /**
   * Obter tarefas do subject
   */
  getTasksFromSubject(): Task[] {
    return this.tasksSubject.value;
  }
}
