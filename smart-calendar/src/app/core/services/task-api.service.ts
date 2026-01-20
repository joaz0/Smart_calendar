import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private apiService = inject(ApiService);

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  /**
   * Obter todas as tarefas
   */
  getAllTasks(page = 1, limit = 50): Observable<Task[]> {
    const params = {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<Task[]>('/tasks', params).pipe(
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
    return this.apiService.get<Task>(`/tasks/${id}`).pipe(
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
  getTasksByStatus(status: string, page = 1, limit = 50): Observable<Task[]> {
    const params = {
      params: {
        status,
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<Task[]>('/tasks', params).pipe(
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
  createTask(task: Partial<Task>): Observable<Task> {
    return this.apiService.post<Task>('/tasks', task).pipe(
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
  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.apiService.patch<Task>(`/tasks/${id}`, task).pipe(
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
    return this.apiService.delete<void>(`/tasks/${id}`).pipe(
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
  searchTasks(query: string, page = 1, limit = 20): Observable<Task[]> {
    const params = {
      params: {
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<Task[]>('/tasks/search', params).pipe(
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
