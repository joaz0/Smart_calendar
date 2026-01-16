// Base Component com padrões reutilizáveis
import { Component, OnDestroy, OnInit } from '@angular/core.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators.component';
import { Logger } from '../utils/logger.component';


/**
 * Classe base para todos os componentes
 * Fornece padrões comuns: lifecycle, logging, unsubscribe automático
 */
@Component({
  template: '',
})
export abstract class BaseComponent implements OnInit, OnDestroy {
  protected logger: Logger;
  protected destroy$ = new Subject<void>();

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  ngOnInit(): void {
    this.logger.info('Componente inicializado');
    this.initialize();
  }

  ngOnDestroy(): void {
    this.logger.info('Componente destruído');
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Método abstrato para inicialização do componente
   * Deve ser implementado pelos componentes filhos
   */
  protected abstract initialize(): void;

  /**
   * Atalho para takeUntil(this.destroy$)
   * Uso: this.service.data$.pipe(this.takeUntil()).subscribe(...)
   */
  protected takeUntil() {
    return takeUntil(this.destroy$);
  }

  /**
   * Log simplificado
   */
  protected log(message: string, data?: any): void {
    this.logger.info(message, data);
  }

  /**
   * Erro simplificado
   */
  protected logError(message: string, error?: any): void {
    this.logger.error(message, error);
  }
}
