import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.component';


export interface ProjectTimeline {
  projectId: string;
  projectName: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  milestones: Milestone[];
  tasks: TimelineTask[];
  dependencies: Dependency[];
}

export interface Milestone {
  id: string;
  name: string;
  date: Date;
  completed: boolean;
  description?: string;
}

export interface TimelineTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
}

export interface Dependency {
  fromTaskId: string;
  toTaskId: string;
  type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish';
}

export interface CriticalPath {
  tasks: TimelineTask[];
  totalDuration: number;
  slack: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectTimelineService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/projects`;

  getProjectTimeline(projectId: string): Observable<ProjectTimeline> {
    return this.http.get<ProjectTimeline>(`${this.apiUrl}/${projectId}/timeline`).pipe(
      catchError(() => of(this.getMockProjectTimeline(projectId)))
    );
  }

  getAllProjects(): Observable<ProjectTimeline[]> {
    return this.http.get<ProjectTimeline[]>(`${this.apiUrl}/timelines`).pipe(
      catchError(() => of([this.getMockProjectTimeline('1'), this.getMockProjectTimeline('2')]))
    );
  }

  getCriticalPath(projectId: string): Observable<CriticalPath> {
    return this.http.get<CriticalPath>(`${this.apiUrl}/${projectId}/critical-path`).pipe(
      catchError(() => of(this.getMockCriticalPath()))
    );
  }

  updateTaskProgress(projectId: string, taskId: string, progress: number): Observable<TimelineTask> {
    return this.http.patch<TimelineTask>(`${this.apiUrl}/${projectId}/tasks/${taskId}`, { progress }).pipe(
      catchError(() => of({} as TimelineTask))
    );
  }

  addMilestone(projectId: string, milestone: Omit<Milestone, 'id'>): Observable<Milestone> {
    return this.http.post<Milestone>(`${this.apiUrl}/${projectId}/milestones`, milestone).pipe(
      catchError(() => of({ ...milestone, id: Date.now().toString() } as Milestone))
    );
  }

  getProjectInsights(projectId: string): Observable<{
    onTrack: boolean;
    daysRemaining: number;
    completionEstimate: Date;
    risks: string[];
    recommendations: string[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/${projectId}/insights`).pipe(
      catchError(() => of(this.getMockProjectInsights()))
    );
  }

  private getMockProjectTimeline(projectId: string): ProjectTimeline {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 60);

    return {
      projectId,
      projectName: `Projeto ${projectId}`,
      startDate,
      endDate,
      progress: 45,
      milestones: this.getMockMilestones(),
      tasks: this.getMockTasks(),
      dependencies: [
        { fromTaskId: 'task-1', toTaskId: 'task-2', type: 'finish_to_start' },
        { fromTaskId: 'task-2', toTaskId: 'task-3', type: 'finish_to_start' }
      ]
    };
  }

  private getMockMilestones(): Milestone[] {
    const now = new Date();
    return [
      {
        id: 'm1',
        name: 'Kickoff do Projeto',
        date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        completed: true,
        description: 'Reunião inicial e definição de escopo'
      },
      {
        id: 'm2',
        name: 'MVP Pronto',
        date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        completed: false,
        description: 'Primeira versão funcional'
      },
      {
        id: 'm3',
        name: 'Launch',
        date: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        completed: false,
        description: 'Lançamento oficial'
      }
    ];
  }

  private getMockTasks(): TimelineTask[] {
    const now = new Date();
    return [
      {
        id: 'task-1',
        name: 'Planejamento e Design',
        startDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        progress: 100,
        assignee: 'João Silva',
        priority: 'high',
        status: 'completed'
      },
      {
        id: 'task-2',
        name: 'Desenvolvimento Core',
        startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        progress: 60,
        assignee: 'Maria Santos',
        priority: 'high',
        status: 'in_progress'
      },
      {
        id: 'task-3',
        name: 'Testes e QA',
        startDate: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        progress: 0,
        assignee: 'Pedro Costa',
        priority: 'medium',
        status: 'not_started'
      },
      {
        id: 'task-4',
        name: 'Documentação',
        startDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000),
        progress: 0,
        assignee: 'Ana Oliveira',
        priority: 'low',
        status: 'not_started'
      }
    ];
  }

  private getMockCriticalPath(): CriticalPath {
    return {
      tasks: this.getMockTasks().slice(0, 3),
      totalDuration: 89,
      slack: 3
    };
  }

  private getMockProjectInsights(): any {
    return {
      onTrack: true,
      daysRemaining: 45,
      completionEstimate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      risks: [
        'Dependência crítica na tarefa de desenvolvimento',
        'Recurso principal com 90% de alocação'
      ],
      recommendations: [
        'Adicionar buffer de 1 semana antes do launch',
        'Considerar trazer mais um desenvolvedor',
        'Iniciar testes em paralelo quando possível'
      ]
    };
  }
}
