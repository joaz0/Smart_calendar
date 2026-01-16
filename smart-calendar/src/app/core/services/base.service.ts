// Base Service com padrões reutilizáveis
import { Injectable, OnDestroy } from '@angular/core.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Logger } from '../utils/logger.component';


/**
 * Classe base para todos os serviços
 * Fornece padrões comuns: loading, error, logging
 */
@Injectable()
export abstract class BaseService implements OnDestroy {
  protected logger: Logger;

  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  private errorSubject$ = new Subject<any>();
  private destroySubject$ = new Subject<void>();

  public loading$ = this.loadingSubject$.asObservable();
  public error$ = this.errorSubject$.asObservable();
  public destroy$ = this.destroySubject$.asObservable();

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Define o estado de loading
   */
  protected setLoading(isLoading: boolean): void {
    this.loadingSubject$.next(isLoading);
  }

  /**
   * Emite um erro
   */
  protected setError(error: any): void {
    this.logger.error('Erro no serviço', error as Record<string, any>);
    this.errorSubject$.next(error);
  }

  /**
   * Limpa o erro
   */
  protected clearError(): void {
    this.errorSubject$.next(null);
  }

  /**
   * Trata operação assíncrona com loading automático
   */
  protected async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    operationName = 'Operação'
  ): Promise<T> {
    try {
      this.setLoading(true);
      this.clearError();
      const result = await operation();
      this.logger.info(`${operationName} concluída com sucesso`);
      return result;
    } catch (error) {
      this.setError(error);
      this.logger.error(`${operationName} falhou`, error as Record<string, any>);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Destroi o serviço
   */
  ngOnDestroy(): void {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }
}
