import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';
import { ApiMapperService } from './api-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient, private mapper: ApiMapperService) {
    this.loadTasks();
  }

  private loadTasks() {
    this.getAllTasks().subscribe(
      (tasks) => this.tasksSubject.next(tasks),
      (error) => console.error('Erro ao carregar tarefas:', error)
    );
  }

  getAllTasks(): Observable<Task[]> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(map((tasks) => tasks.map((t) => this.mapper.fromApiTask(t))));
  }

  getTaskById(id: string): Observable<Task> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((t) => this.mapper.fromApiTask(t)));
  }

  createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Observable<Task> {
    const payload = this.mapper.toApiTask(task as any);
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map((t) => this.mapper.fromApiTask(t)),
      tap((newTask) => this.tasksSubject.next([...this.tasksSubject.value, newTask]))
    );
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    const payload = this.mapper.toApiTask(task as any);
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map((t) => this.mapper.fromApiTask(t)),
      tap((updatedTask) => {
        const currentTasks = this.tasksSubject.value;
        const idx = currentTasks.findIndex((t) => t.id === id);
        if (idx !== -1) {
          currentTasks[idx] = updatedTask;
          this.tasksSubject.next([...currentTasks]);
        }
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next(currentTasks.filter((t) => t.id !== id));
      })
    );
  }

  searchTasks(query: string): Observable<Task[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/search`, { params: { q: query } })
      .pipe(map((tasks) => tasks.map((t) => this.mapper.fromApiTask(t))));
  }
}
