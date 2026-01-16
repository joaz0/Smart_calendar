import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export interface SmartTask {
  id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number;
  suggestedTime?: Date;
  dependencies?: string[];
  category: string;
}

export interface TaskPrioritization {
  taskId: string;
  score: number;
  reasons: string[];
  suggestedOrder: number;
}

export interface TaskBreakdown {
  originalTaskId: string;
  subtasks: SmartTask[];
  estimatedTotalTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class IntelligentTaskingService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/ai/tasks`;

  prioritizeTasks(tasks: SmartTask[]): Observable<TaskPrioritization[]> {
    return this.http.post<TaskPrioritization[]>(`${this.apiUrl}/prioritize`, { tasks }).pipe(
      catchError(() => of(this.getMockPrioritization(tasks)))
    );
  }

  suggestScheduling(task: SmartTask, availability: Date[]): Observable<{ suggestedTime: Date; confidence: number }> {
    return this.http.post<any>(`${this.apiUrl}/schedule`, { task, availability }).pipe(
      catchError(() => of({ suggestedTime: availability[0], confidence: 0.8 }))
    );
  }

  breakdownTask(task: SmartTask): Observable<TaskBreakdown> {
    return this.http.post<TaskBreakdown>(`${this.apiUrl}/breakdown`, task).pipe(
      catchError(() => of(this.getMockBreakdown(task)))
    );
  }

  estimateDuration(taskDescription: string): Observable<{ duration: number; confidence: number }> {
    return this.http.post<any>(`${this.apiUrl}/estimate`, { description: taskDescription }).pipe(
      catchError(() => of({ duration: 60, confidence: 0.7 }))
    );
  }

  suggestDependencies(tasks: SmartTask[]): Observable<{ taskId: string; dependencies: string[] }[]> {
    return this.http.post<any[]>(`${this.apiUrl}/dependencies`, { tasks }).pipe(
      catchError(() => of([]))
    );
  }

  private getMockPrioritization(tasks: SmartTask[]): TaskPrioritization[] {
    return tasks.map((task, index) => ({
      taskId: task.id || `task-${index}`,
      score: Math.random() * 100,
      reasons: ['Alta urgência', 'Impacto significativo', 'Poucas dependências'],
      suggestedOrder: index + 1
    })).sort((a, b) => b.score - a.score);
  }

  private getMockBreakdown(task: SmartTask): TaskBreakdown {
    return {
      originalTaskId: task.id || 'task-1',
      subtasks: [
        {
          title: `${task.title} - Fase 1: Planejamento`,
          description: 'Definir escopo e requisitos',
          priority: 'high',
          estimatedDuration: task.estimatedDuration * 0.2,
          category: task.category
        },
        {
          title: `${task.title} - Fase 2: Execução`,
          description: 'Implementar a solução',
          priority: 'high',
          estimatedDuration: task.estimatedDuration * 0.6,
          category: task.category
        },
        {
          title: `${task.title} - Fase 3: Revisão`,
          description: 'Testar e validar resultados',
          priority: 'medium',
          estimatedDuration: task.estimatedDuration * 0.2,
          category: task.category
        }
      ],
      estimatedTotalTime: task.estimatedDuration
    };
  }
}
