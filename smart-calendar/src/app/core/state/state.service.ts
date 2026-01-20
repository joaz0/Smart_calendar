// State Management Base
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';


/**
 * Interface para estado
 */
export interface State {
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

/**
 * Classe base para estado gerenciado
 * Fornece padrões para BehaviorSubject com histórico
 */
@Injectable()
export abstract class StateService<T extends State> {
  protected stateSubject$: BehaviorSubject<T>;
  public state$: Observable<T>;

  constructor(initialState: T) {
    this.stateSubject$ = new BehaviorSubject<T>(initialState);
    this.state$ = this.stateSubject$.asObservable();
  }

  /**
   * Obtém o estado atual
   */
  getState(): T {
    return this.stateSubject$.value;
  }

  /**
   * Atualiza o estado
   */
  protected setState(newState: Partial<T>): void {
    const currentState = this.getState();
    this.stateSubject$.next({
      ...currentState,
      ...newState,
      lastUpdated: new Date(),
    } as T);
  }

  /**
   * Reseta para estado inicial
   */
  protected resetState(initialState: T): void {
    this.stateSubject$.next(initialState);
  }

  /**
   * Observa uma propriedade específica do estado
   */
  selectProperty<K extends keyof T>(key: K): Observable<T[K]> {
    return this.state$.pipe(
      map((state) => state[key]),
      distinctUntilChanged()
    );
  }

  /**
   * Seleciona uma projeção do estado com deduplicação
   */
  select<K>(selector: (state: T) => K): Observable<K> {
    return this.state$.pipe(
      map(selector),
      distinctUntilChanged()
    );
  }
}
