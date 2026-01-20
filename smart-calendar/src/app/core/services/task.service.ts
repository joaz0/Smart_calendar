import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Task } from '../models/task.model';
import { TaskApiService } from './task-api.service';
import { Logger } from '../utils/logger.component';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskApiService = inject(TaskApiService);

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private logger = new Logger('TaskService');

  constructor() {
    this.loadTasks();
  }

  private loadTasks() {
    this.getAllTasks().subscribe({
      next: (tasks) => {
        this.logger.info('Tarefas carregadas com sucesso', { count: tasks.length });
        this.tasksSubject.next(tasks);
      },
      error: (error) => this.logger.error('Erro ao carregar tarefas', error),
    });
  }

  getAllTasks(page = 1, limit = 50): Observable<Task[]> {
    return this.taskApiService.getAllTasks(page, limit).pipe(
      catchError((error) => {
        this.logger.error('Erro ao buscar todas as tarefas', error);
        return of([]);
      })
    );
  }

  getTaskById(id: string): Observable<Task | null> {
    return this.taskApiService.getTaskById(Number(id)).pipe(
      catchError((error) => {
        this.logger.error('Erro ao buscar tarefa por ID', error);
        return of(null);
      })
    );
  }

  getTasksByStatus(
    status: 'pending' | 'in_progress' | 'completed',
    page = 1,
    limit = 50
  ): Observable<Task[]> {
    return this.taskApiService.getTasksByStatus(status, page, limit).pipe(
      catchError((error) => {
        this.logger.error('Erro ao buscar tarefas por status', error);
        return of([]);
      })
    );
  }

  createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Observable<Task> {
    this.logger.info('Criando nova tarefa', { title: task.title });
    return this.taskApiService.createTask(task as unknown as Parameters<typeof this.taskApiService.createTask>[0]).pipe(
      tap((newTask) => {
        this.logger.info('Tarefa criada com sucesso', { id: newTask.id });
        this.tasksSubject.next([...this.tasksSubject.value, newTask]);
      }),
      catchError((error) => {
        this.logger.error('Erro ao criar tarefa', error);
        throw error;
      })
    );
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    this.logger.info('Atualizando tarefa', { id });
    return this.taskApiService.updateTask(Number(id), task).pipe(
      tap((updatedTask) => {
        this.logger.info('Tarefa atualizada com sucesso', { id });
        const currentTasks = this.tasksSubject.value;
        const idx = currentTasks.findIndex((t) => t.id === id);
        if (idx !== -1) {
          currentTasks[idx] = updatedTask;
          this.tasksSubject.next([...currentTasks]);
        }
      }),
      catchError((error) => {
        this.logger.error('Erro ao atualizar tarefa', error);
        throw error;
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    this.logger.info('Deletando tarefa', { id });
    return this.taskApiService.deleteTask(Number(id)).pipe(
      tap(() => {
        this.logger.info('Tarefa deletada com sucesso', { id });
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next(currentTasks.filter((t) => t.id !== id));
      }),
      catchError((error) => {
        this.logger.error('Erro ao deletar tarefa', error);
        throw error;
      })
    );
  }

  searchTasks(query: string, page = 1, limit = 50): Observable<Task[]> {
    this.logger.info('Buscando tarefas', { query });
    return this.taskApiService.searchTasks(query, page, limit).pipe(
      catchError((error) => {
        this.logger.error('Erro ao buscar tarefas', error);
        return of([]);
      })
    );
  }

  getTasksByPriority(priority: 'low' | 'medium' | 'high'): Observable<Task[]> {
    this.logger.info('Buscando tarefas por prioridade', { priority });
    return this.getAllTasks().pipe(
      map((tasks) => tasks.filter((t) => t.priority === priority)),
      catchError((error) => {
        this.logger.error('Erro ao buscar tarefas por prioridade', error);
        return of([]);
      })
    );
  }
}
