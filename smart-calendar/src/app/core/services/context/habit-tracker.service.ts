import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Habit, HabitCompletion, HabitStats } from '../../models/context/habit.model';

@Injectable({
  providedIn: 'root'
})
export class HabitTrackerService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/habits`;
  private habitsSubject = new BehaviorSubject<Habit[]>([]);
  public habits$ = this.habitsSubject.asObservable();

  constructor() {
    this.loadHabits();
  }

  loadHabits(): void {
    this.http.get<Habit[]>(this.apiUrl).pipe(
      catchError(() => of(this.getMockHabits()))
    ).subscribe(habits => {
      this.habitsSubject.next(habits);
    });
  }

  getHabits(): Observable<Habit[]> {
    return this.habits$;
  }

  getHabit(id: string): Observable<Habit | undefined> {
    return this.habits$.pipe(
      map(habits => habits.find(h => h.id === id))
    );
  }

  createHabit(habit: Partial<Habit>): Observable<Habit> {
    const newHabit: Habit = {
      id: this.generateId(),
      userId: 'current-user',
      title: habit.title || '',
      description: habit.description,
      category: habit.category || 'other',
      frequency: habit.frequency || 'daily',
      targetDays: habit.targetDays,
      goalCount: habit.goalCount,
      reminderTime: habit.reminderTime,
      icon: habit.icon || 'check_circle',
      color: habit.color || '#4CAF50',
      createdAt: new Date(),
      streak: 0,
      bestStreak: 0,
      completions: [],
      isActive: true
    };

    return this.http.post<Habit>(this.apiUrl, newHabit).pipe(
      tap(created => {
        const habits = this.habitsSubject.value;
        this.habitsSubject.next([...habits, created]);
      }),
      catchError(() => {
        const habits = this.habitsSubject.value;
        this.habitsSubject.next([...habits, newHabit]);
        return of(newHabit);
      })
    );
  }

  updateHabit(id: string, updates: Partial<Habit>): Observable<Habit> {
    return this.http.put<Habit>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updated => {
        const habits = this.habitsSubject.value;
        const index = habits.findIndex(h => h.id === id);
        if (index !== -1) {
          habits[index] = { ...habits[index], ...updated };
          this.habitsSubject.next([...habits]);
        }
      }),
      catchError(() => {
        const habits = this.habitsSubject.value;
        const index = habits.findIndex(h => h.id === id);
        if (index !== -1) {
          habits[index] = { ...habits[index], ...updates };
          this.habitsSubject.next([...habits]);
        }
        return of(habits[index]);
      })
    );
  }

  deleteHabit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const habits = this.habitsSubject.value.filter(h => h.id !== id);
        this.habitsSubject.next(habits);
      }),
      catchError(() => {
        const habits = this.habitsSubject.value.filter(h => h.id !== id);
        this.habitsSubject.next(habits);
        return of(undefined);
      })
    );
  }

  toggleCompletion(habitId: string, date: Date): Observable<Habit> {
    return this.http.post<Habit>(`${this.apiUrl}/${habitId}/toggle`, { date }).pipe(
      tap(updated => {
        const habits = this.habitsSubject.value;
        const index = habits.findIndex(h => h.id === habitId);
        if (index !== -1) {
          habits[index] = updated;
          this.habitsSubject.next([...habits]);
        }
      }),
      catchError(() => {
        const habits = this.habitsSubject.value;
        const index = habits.findIndex(h => h.id === habitId);
        if (index !== -1) {
          const habit = habits[index];
          const dateStr = date.toDateString();
          const completionIndex = habit.completions.findIndex(
            c => new Date(c.date).toDateString() === dateStr
          );

          if (completionIndex >= 0) {
            habit.completions[completionIndex].completed = !habit.completions[completionIndex].completed;
          } else {
            habit.completions.push({ date, completed: true });
          }

          habit.streak = this.calculateStreak(habit);
          habit.bestStreak = Math.max(habit.bestStreak, habit.streak);
          
          this.habitsSubject.next([...habits]);
        }
        return of(habits[index]);
      })
    );
  }

  getHabitStats(habitId: string): Observable<HabitStats> {
    return this.habits$.pipe(
      map(habits => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) {
          return this.getEmptyStats();
        }

        const now = new Date();
        const last7Days = habit.completions.filter(c => {
          const daysDiff = Math.floor((now.getTime() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24));
          return daysDiff <= 7 && c.completed;
        }).length;

        const last30Days = habit.completions.filter(c => {
          const daysDiff = Math.floor((now.getTime() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24));
          return daysDiff <= 30 && c.completed;
        }).length;

        const totalCompletions = habit.completions.filter(c => c.completed).length;
        const totalDays = Math.floor((now.getTime() - habit.createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const completionRate = totalDays > 0 ? (totalCompletions / totalDays) * 100 : 0;

        return {
          totalCompletions,
          currentStreak: habit.streak,
          bestStreak: habit.bestStreak,
          completionRate: Math.round(completionRate),
          last7Days,
          last30Days
        };
      })
    );
  }

  private calculateStreak(habit: Habit): number {
    const sorted = [...habit.completions]
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sorted.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sorted.length; i++) {
      const completionDate = new Date(sorted[i].date);
      completionDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);

      if (completionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private getEmptyStats(): HabitStats {
    return {
      totalCompletions: 0,
      currentStreak: 0,
      bestStreak: 0,
      completionRate: 0,
      last7Days: 0,
      last30Days: 0
    };
  }

  private getMockHabits(): Habit[] {
    return [
      {
        id: '1',
        userId: 'user1',
        title: 'Meditar 10 minutos',
        description: 'Meditação matinal para começar o dia com clareza',
        category: 'health',
        frequency: 'daily',
        icon: 'spa',
        color: '#4CAF50',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        streak: 5,
        bestStreak: 12,
        completions: this.generateMockCompletions(30, 0.75),
        isActive: true
      },
      {
        id: '2',
        userId: 'user1',
        title: 'Ler 30 páginas',
        description: 'Leitura diária para aprendizado contínuo',
        category: 'learning',
        frequency: 'daily',
        icon: 'menu_book',
        color: '#2196F3',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        streak: 3,
        bestStreak: 18,
        completions: this.generateMockCompletions(45, 0.65),
        isActive: true
      },
      {
        id: '3',
        userId: 'user1',
        title: 'Exercício Físico',
        description: '30 minutos de atividade física',
        category: 'health',
        frequency: 'daily',
        icon: 'fitness_center',
        color: '#FF9800',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        streak: 2,
        bestStreak: 7,
        completions: this.generateMockCompletions(20, 0.55),
        isActive: true
      }
    ];
  }

  private generateMockCompletions(days: number, successRate: number): HabitCompletion[] {
    const completions: HabitCompletion[] = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);

      completions.push({
        date,
        completed: Math.random() < successRate
      });
    }

    return completions;
  }

  private generateId(): string {
    return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
