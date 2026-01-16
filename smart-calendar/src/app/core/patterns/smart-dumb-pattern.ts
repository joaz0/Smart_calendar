// Padrão de Componente Smart (Container/Presenter)
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseComponent } from '../../core/components/base.component';
import { ListColumn, ListAction } from '../components/base-list.component';
import { EventService } from '../services/event.service';

/**
 * CONTAINER COMPONENT (Smart Component)
 * - Lida com lógica e estado
 * - Chama serviços
 * - Passa dados para componentes apresentadores
 */
@Component({
  selector: 'app-events-container',
  standalone: true,
  imports: [CommonModule, EventsListComponent],
  template: `
    <app-events-list
      [items]="events$ | async"
      [loading]="loading"
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
  private eventService = inject(EventService);

  // Observables (dados do serviço)
  get events$() {
    return this.eventService.events$;
  }
  loading = false;

  // Configuração para o componente apresentador
  columns = [
    { key: 'title', label: 'Título', sortable: true },
    { key: 'startDate', label: 'Data', type: 'date' },
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

  protected initialize(): void {
    // Events are already loaded in the EventService constructor
  }

  onPageChange(event: { page: number; pageSize: number }): void {
    this.loading = true;
    this.eventService.getAllEvents(event.page, event.pageSize).pipe(this.takeUntil()).subscribe({
      complete: () => this.loading = false
    });
  }

  onSearch(query: string): void {
    this.loading = true;
    if (query) {
      this.eventService.searchEvents(query).pipe(this.takeUntil()).subscribe({
        complete: () => this.loading = false
      });
    } else {
      this.eventService.getAllEvents().pipe(this.takeUntil()).subscribe({
        complete: () => this.loading = false
      });
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
    this.loading = true;
    this.eventService.deleteEvent(event.id).pipe(this.takeUntil()).subscribe({
      complete: () => this.loading = false
    });
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
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="list-container">
      <div class="list-header">
        <input type="text" placeholder="Buscar..." (input)="onSearchChange($event)" />
      </div>
    
      @if (loading) {
        <mat-spinner></mat-spinner>
      }
    
      @if (!loading && items?.length > 0) {
        <div class="list-items">
          @for (item of items; track item) {
            <div class="list-item">
              @for (col of columns; track col) {
                <div [ngClass]="'col-' + col.key">
                  {{ getColumnValue(item, col) | date : (col.type === 'date' ? 'shortDate' : '') }}
                </div>
              }
              <div class="actions">
                @for (action of actions; track action) {
                  <button
                    (click)="executeAction(action, item)"
                    [attr.aria-label]="action.label"
                    >
                    {{ action.label }}
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    
      @if (!loading && (!items || items.length === 0)) {
        <div class="empty-state">
          <p>Nenhum item encontrado</p>
        </div>
      }
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
