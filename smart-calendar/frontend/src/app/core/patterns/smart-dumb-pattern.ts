import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Padrão Smart/Dumb (Container/Presentational)
 * Esta é uma interface/classe base abstrata para documentação e tipagem.
 * NÃO importe componentes específicos aqui para evitar dependências circulares.
 */

// Interface para componentes "Dumb" (Apenas recebem dados e emitem eventos)
export interface PresentationComponent<T> {
  data: T | null;
  action: EventEmitter<any>;
}

// Interface para componentes "Smart" (Gerenciam estado e serviços)
export interface ContainerComponent {
  loadData(): void;
  handleAction(event: any): void;
}

// Exemplo abstrato (Comentado para não quebrar o build se não usado)
/*
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class BasePresentationComponent<T> implements PresentationComponent<T> {
  @Input() data: T | null = null;
  @Output() action = new EventEmitter<any>();
}
*/
