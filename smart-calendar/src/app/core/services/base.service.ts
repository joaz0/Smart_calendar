// Base Service com padrões reutilizáveis
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Logger } from '../utils/logger';

/**
 * Classe base para todos os serviços
 * Fornece padrões comuns: loading, error, logging
 */
@Injectable()
export abstract class BaseService {
  protected logger: Logger;

  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  private errorSubject$ = new Subject<any>();
  private destroySubject$ = new Subject<void>();

  public loading$ = this.loadingSubject$.asObservable();
  public error$ = this.errorSubject$.asObservable();
  public destroy$ = this.destroySubject$.asObservable();

  constructor(serviceName: string = 'BaseService') {
    this.logger = new Logger(serviceName);
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
    this.logger.error('Erro no serviço', error);
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
    operationName: string = 'Operação'
  ): Promise<T> {
    try {
      this.setLoading(true);
      this.clearError();
      const result = await operation();
      this.logger.info(`${operationName} concluída com sucesso`);
      return result;
    } catch (error) {
      this.setError(error);
      this.logger.error(`${operationName} falhou`, error);
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
