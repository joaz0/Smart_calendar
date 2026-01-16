// Padrão de componente list/table reutilizável
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core.component';
import { BaseComponent } from '../../core/components/base.component';


export interface ListAction {
  label: string;
  icon?: string;
  color?: string;
  action: (_item: any) => void;
}

export interface ListColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'number' | 'boolean' | 'custom';
  sortable?: boolean;
  width?: string;
}

/**
 * Componente base para listas/tabelas
 * Fornece padrões para paginação, filtros, ações
 */
@Component({
  template: '',
})
export abstract class BaseListComponent<T> extends BaseComponent implements OnInit {
  @Input() items: T[] = [];
  @Input() columns: ListColumn[] = [];
  @Input() actions: ListAction[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() pageSize = 20;
  @Input() pageSizeOptions = [10, 20, 50, 100];

  @Output() pageChange = new EventEmitter<{ page: number; pageSize: number }>();
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
  @Output() filterChange = new EventEmitter<any>();
  @Output() itemSearch = new EventEmitter<string>();

  currentPage = 1;
  searchQuery = '';
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  displayedColumns: string[] = [];

  constructor() {
    super();
  }

  protected initialize(): void {
    this.setupColumns();
  }

  /**
   * Configura colunas exibidas
   */
  setupColumns(): void {
    this.displayedColumns = this.columns
      .map((col) => col.key)
      .concat(this.actions.length > 0 ? ['actions'] : []);
  }

  /**
   * Muda página
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.pageChange.emit({ page, pageSize: this.pageSize });
  }

  /**
   * Muda tamanho da página
   */
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.pageChange.emit({ page: 1, pageSize });
  }

  /**
   * Ordena por coluna
   */
  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({ column, direction: this.sortDirection });
  }

  /**
   * Busca
   */
  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.itemSearch.emit(query);
  }

  /**
   * Executa ação sobre item
   */
  executeAction(action: ListAction, item: T): void {
    this.log(`Executando ação: ${action.label}`);
    action.action(item);
  }

  /**
   * Obtém valor da coluna para exibição
   */
  getColumnValue(item: T, column: ListColumn): any {
    const keys = column.key.split('.');
    let value: any = item;

    for (const key of keys) {
      value = value?.[key as keyof typeof value];
    }

    return value;
  }

  /**
   * Formata valor para exibição
   */
  formatValue(value: any, type?: string): string {
    if (value === null || value === undefined) return '-';

    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString('pt-BR');
      case 'boolean':
        return value ? 'Sim' : 'Não';
      case 'number':
        return Number(value).toLocaleString('pt-BR');
      default:
        return String(value);
    }
  }
}
