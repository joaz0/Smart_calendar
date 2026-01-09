// Entity Service Base - Para CRUD operations
import { Injectable } from '@angular/core';
import { BaseService } from '../services/base.service';
import { ApiService } from '../services/api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Interface base para entidades
 */
export interface Entity {
  id: string | number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Classe base para serviços de entidades (CRUD)
 */
@Injectable()
export abstract class EntityService<T extends Entity> extends BaseService {
  protected apiEndpoint: string;
  protected entitiesSubject$ = new BehaviorSubject<T[]>([]);
  public entities$ = this.entitiesSubject$.asObservable();

  constructor(protected apiService: ApiService, serviceName: string, apiEndpoint: string) {
    super(serviceName);
    this.apiEndpoint = apiEndpoint;
  }

  /**
   * Busca todas as entidades
   */
  getAll(page: number = 1, limit: number = 20): Observable<T[]> {
    return this.apiService
      .get<{ data: T[] }>(`${this.apiEndpoint}?page=${page}&limit=${limit}`)
      .pipe(
        map((response) => response.data || []),
        tap((entities) => this.entitiesSubject$.next(entities)),
        catchError((error) => {
          this.setError(error);
          return of([]);
        })
      );
  }

  /**
   * Busca uma entidade por ID
   */
  getById(id: string | number): Observable<T> {
    return this.apiService.get<{ data: T }>(`${this.apiEndpoint}/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        this.setError(error);
        throw error;
      })
    );
  }

  /**
   * Cria uma nova entidade
   */
  create(entity: Omit<T, 'id'>): Observable<T> {
    this.setLoading(true);
    return this.apiService.post<{ data: T }>(this.apiEndpoint, entity).pipe(
      map((response) => response.data),
      tap((newEntity) => {
        const current = this.entitiesSubject$.value;
        this.entitiesSubject$.next([...current, newEntity]);
        this.setLoading(false);
      }),
      catchError((error) => {
        this.setError(error);
        this.setLoading(false);
        throw error;
      })
    );
  }

  /**
   * Atualiza uma entidade
   */
  update(id: string | number, entity: Partial<T>): Observable<T> {
    this.setLoading(true);
    return this.apiService.put<{ data: T }>(`${this.apiEndpoint}/${id}`, entity).pipe(
      map((response) => response.data),
      tap((updatedEntity) => {
        const current = this.entitiesSubject$.value;
        const index = current.findIndex((e) => e.id === id);
        if (index !== -1) {
          current[index] = updatedEntity;
          this.entitiesSubject$.next([...current]);
        }
        this.setLoading(false);
      }),
      catchError((error) => {
        this.setError(error);
        this.setLoading(false);
        throw error;
      })
    );
  }

  /**
   * Deleta uma entidade
   */
  delete(id: string | number): Observable<void> {
    this.setLoading(true);
    return this.apiService.delete<void>(`${this.apiEndpoint}/${id}`).pipe(
      tap(() => {
        const current = this.entitiesSubject$.value;
        this.entitiesSubject$.next(current.filter((e) => e.id !== id));
        this.setLoading(false);
      }),
      catchError((error) => {
        this.setError(error);
        this.setLoading(false);
        throw error;
      })
    );
  }

  /**
   * Busca com filtro
   */
  search(query: string): Observable<T[]> {
    return this.apiService.get<{ data: T[] }>(`${this.apiEndpoint}/search?q=${query}`).pipe(
      map((response) => response.data || []),
      catchError((error) => {
        this.setError(error);
        return of([]);
      })
    );
  }

  /**
   * Obtém entidades locais do BehaviorSubject
   */
  getLocal(): T[] {
    return this.entitiesSubject$.value;
  }

  /**
   * Atualiza entidades locais
   */
  setLocal(entities: T[]): void {
    this.entitiesSubject$.next(entities);
  }

  /**
   * Adiciona entidade local
   */
  addLocal(entity: T): void {
    const current = this.entitiesSubject$.value;
    this.entitiesSubject$.next([...current, entity]);
  }

  /**
   * Remove entidade local
   */
  removeLocal(id: string | number): void {
    const current = this.entitiesSubject$.value;
    this.entitiesSubject$.next(current.filter((e) => e.id !== id));
  }
}
