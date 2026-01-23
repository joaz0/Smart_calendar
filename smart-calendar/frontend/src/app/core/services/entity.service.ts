// Entity Service Base - Para CRUD operations
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { BaseService } from './base.service';
import { ApiService, ApiResponse } from './api.service';
import { Entity } from '../models/common-interfaces';

@Injectable()
export abstract class EntityService<T extends Entity> extends BaseService {
  protected entitiesSubject$ = new BehaviorSubject<T[]>([]);
  public entities$ = this.entitiesSubject$.asObservable();

  protected selectedEntitySubject$ = new BehaviorSubject<T | null>(null);
  public selectedEntity$ = this.selectedEntitySubject$.asObservable();

  constructor(protected apiService: ApiService, protected apiEndpoint: string) {
    super();
  }

  getAll(page = 1, limit = 20): Observable<T[]> {
    this.setLoading(true);

    return this.apiService.get<T[]>(`${this.apiEndpoint}?page=${page}&limit=${limit}`).pipe(
      map((response: ApiResponse<T[]>) => response.data || []),
      tap((entities) => {
        this.entitiesSubject$.next(entities);
        this.setError(null);
      }),
      catchError((error) => {
        this.setError(error);
        return of([] as T[]);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  getById(id: string | number): Observable<T | null> {
    this.setLoading(true);

    return this.apiService.get<T>(`${this.apiEndpoint}/${id}`).pipe(
      map((response: ApiResponse<T>) => response.data || null),
      tap((entity) => {
        if (entity) {
          this.selectedEntitySubject$.next(entity);
          this.setError(null);
        }
      }),
      catchError((error) => {
        this.setError(error);
        return of(null);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  create(entity: Omit<T, 'id'> | Partial<T>): Observable<T | null> {
    this.setLoading(true);

    return this.apiService.post<T>(this.apiEndpoint, entity).pipe(
      map((response: ApiResponse<T>) => response.data || null),
      tap((newEntity) => {
        if (newEntity) {
          const currentList = this.entitiesSubject$.value;
          this.entitiesSubject$.next([...currentList, newEntity]);
        }
      }),
      catchError((error) => {
        this.setError(error);
        throw error;
      }),
      finalize(() => this.setLoading(false))
    );
  }

  update(id: string | number, entity: Partial<T>): Observable<T | null> {
    this.setLoading(true);

    return this.apiService.put<T>(`${this.apiEndpoint}/${id}`, entity).pipe(
      map((response: ApiResponse<T>) => response.data || null),
      tap((updatedEntity) => {
        if (updatedEntity) {
          const currentList = this.entitiesSubject$.value;
          const index = currentList.findIndex((e) => e.id === id);
          if (index !== -1) {
            const newList = [...currentList];
            newList[index] = updatedEntity;
            this.entitiesSubject$.next(newList);
          }
          if (this.selectedEntitySubject$.value?.id === id) {
            this.selectedEntitySubject$.next(updatedEntity);
          }
        }
      }),
      catchError((error) => {
        this.setError(error);
        throw error;
      }),
      finalize(() => this.setLoading(false))
    );
  }

  delete(id: string | number): Observable<boolean> {
    this.setLoading(true);

    return this.apiService.delete<void>(`${this.apiEndpoint}/${id}`).pipe(
      map((response: ApiResponse<void>) => response.success),
      tap((success) => {
        if (success) {
          const currentList = this.entitiesSubject$.value;
          this.entitiesSubject$.next(currentList.filter((e) => e.id !== id));

          if (this.selectedEntitySubject$.value?.id === id) {
            this.selectedEntitySubject$.next(null);
          }
        }
      }),
      catchError((error) => {
        this.setError(error);
        return of(false);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  search(query: string, page = 1, limit = 20): Observable<T[]> {
    this.setLoading(true);

    return this.apiService.get<T[]>(`${this.apiEndpoint}/search?q=${query}&page=${page}&limit=${limit}`).pipe(
      map((response: ApiResponse<T[]>) => response.data || []),
      catchError((error) => {
        this.setError(error);
        return of([] as T[]);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  getLocal(): T[] {
    return this.entitiesSubject$.value;
  }

  setLocal(entities: T[]): void {
    this.entitiesSubject$.next(entities);
  }

  addLocal(entity: T): void {
    const current = this.entitiesSubject$.value;
    this.entitiesSubject$.next([...current, entity]);
  }

  removeLocal(id: string | number): void {
    const current = this.entitiesSubject$.value;
    this.entitiesSubject$.next(current.filter((e) => e.id !== id));
  }
}
