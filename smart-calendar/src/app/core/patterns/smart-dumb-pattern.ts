// Padrão de Componente Smart (Container/Presenter)
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/components/base.component';

/**
 * CONTAINER COMPONENT (Smart Component)
 * - Lida com lógica e estado
 * - Chama serviços
 * - Passa dados para componentes apresentadores
 */
@Component({
  selector: 'app-events-container',
  template: `
    <app-events-list
      [items]="events$ | async"
      [loading]="loading$ | async"
      [columns]="columns"
      [actions]="actions"
      (pageChange)="onPageChange($event)"
      (search)="onSearch($event)"
      (action)="onAction($event)"
    ></app-events-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsContainerComponent extends BaseComponent implements OnInit {
  // Observables (dados do serviço)
  events$ = this.eventService.entities$;
  loading$ = this.eventService.loading$;

  // Configuração para o componente apresentador
  columns = [
    { key: 'title', label: 'Título', sortable: true },
    { key: 'date', label: 'Data', type: 'date' },
    { key: 'description', label: 'Descrição' },
  ];

  actions = [
    { label: 'Editar', icon: 'edit', action: (item: any) => this.editEvent(item) },
    {
      label: 'Deletar',
      icon: 'delete',
      color: 'warn',
      action: (item: any) => this.deleteEvent(item),
    },
  ];

  constructor(private eventService: EventService) {
    super('EventsContainerComponent');
  }

  protected initialize(): void {
    // Carregar eventos ao inicializar
    this.eventService.getAll().pipe(this.takeUntil()).subscribe();
  }

  onPageChange(event: { page: number; pageSize: number }): void {
    this.eventService.getAll(event.page, event.pageSize).pipe(this.takeUntil()).subscribe();
  }

  onSearch(query: string): void {
    if (query) {
      this.eventService.search(query).pipe(this.takeUntil()).subscribe();
    } else {
      this.eventService.getAll().pipe(this.takeUntil()).subscribe();
    }
  }

  onAction(action: { type: string; item: any }): void {
    // Delegar para método apropriado
  }

  private editEvent(event: any): void {
    // Abrir modal/navegação para edição
  }

  private deleteEvent(event: any): void {
    // Confirmar e deletar
    this.eventService.delete(event.id).pipe(this.takeUntil()).subscribe();
  }
}

/**
 * PRESENTATIONAL COMPONENT (Dumb Component)
 * - Apenas recebe @Input
 * - Apenas emite @Output
 * - Sem lógica de negócio
 * - Reutilizável
 */
@Component({
  selector: 'app-events-list',
  template: `
    <div class="list-container">
      <div class="list-header">
        <input type="text" placeholder="Buscar..." (input)="onSearchChange($event)" />
      </div>

      <mat-spinner *ngIf="loading"></mat-spinner>

      <div *ngIf="!loading && items?.length > 0" class="list-items">
        <div *ngFor="let item of items" class="list-item">
          <div *ngFor="let col of columns" [ngClass]="'col-' + col.key">
            {{ getColumnValue(item, col) | date : (col.type === 'date' ? 'shortDate' : '') }}
          </div>
          <div class="actions">
            <button
              *ngFor="let action of actions"
              (click)="executeAction(action, item)"
              [attr.aria-label]="action.label"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && (!items || items.length === 0)" class="empty-state">
        <p>Nenhum item encontrado</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListComponent {
  @Input() items: any[] | null = null;
  @Input() columns: ListColumn[] = [];
  @Input() actions: ListAction[] = [];
  @Input() loading = false;

  @Output() pageChange = new EventEmitter<{ page: number; pageSize: number }>();
  @Output() search = new EventEmitter<string>();

  onSearchChange(event: any): void {
    this.search.emit(event.target.value);
  }

  executeAction(action: ListAction, item: any): void {
    action.action(item);
  }

  getColumnValue(item: any, column: ListColumn): any {
    return item[column.key];
  }
}
