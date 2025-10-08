// src/app/core/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model'; // Importar do modelo unificado
import { ApiMapperService } from './api-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}`;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  // inject mapper via property injector to avoid breaking constructors in tests where not provided
  mapper!: ApiMapperService;

  setMapper(mapper: ApiMapperService) {
    this.mapper = mapper;
  }

  private loadTasks() {
    this.getTasks().subscribe({
      next: (tasks) => {
        this.tasksSubject.next(tasks);
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.tasksSubject.next([]);
      },
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`).pipe(
      // map api payload to front model when mapper available
      map((list: any[]) => (this.mapper ? list.map((a) => this.mapper.fromApiTask(a)) : list))
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http
      .get<Task>(`${this.apiUrl}/tasks/${id}`)
      .pipe(map((a: any) => (this.mapper ? this.mapper.fromApiTask(a) : a)));
  }

  createTask(task: Partial<Task>): Observable<Task> {
    const payload = this.mapper ? this.mapper.toApiTask(task) : task;
    return this.http.post<Task>(`${this.apiUrl}/tasks`, payload).pipe(tap(() => this.loadTasks()));
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    const payload = this.mapper ? this.mapper.toApiTask(task) : task;
    return this.http
      .put<Task>(`${this.apiUrl}/tasks/${id}`, payload)
      .pipe(tap(() => this.loadTasks()));
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`).pipe(tap(() => this.loadTasks()));
  }

  searchTasks(query: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/search?q=${encodeURIComponent(query)}`);
  }
}
