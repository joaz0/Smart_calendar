import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category, CategoryService } from '../services/category.service';

export interface ListColumn {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (value: any, row?: any) => string;
  width?: string;
}

export interface ListAction {
  icon: string;
  label: string;
  handler: (row: any) => void;
}

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule
],
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  private categoryService = inject(CategoryService);

  private destroy$ = new Subject<void>();
  
  items: Category[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  pageSizeOptions = [5, 10, 20, 50];
  
  columns: ListColumn[] = [];
  actions: ListAction[] = [];
  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initialize(): void {
    this.columns = [
      {
        key: 'name',
        label: 'Nome',
        sortable: true,
        width: '30%',
      },
      {
        key: 'description',
        label: 'Descrição',
        formatter: (value) => this.truncate(value || '', 50),
      },
      {
        key: 'color',
        label: 'Cor',
        formatter: (value) => value?.toUpperCase() || '-',
      },
      {
        key: 'createdAt',
        label: 'Criada em',
        sortable: true,
        formatter: (value) => this.formatDate(value),
      },
    ];

    this.displayedColumns = [...this.columns.map(col => col.key), 'actions'];

    this.actions = [
      {
        icon: 'edit',
        label: 'Editar',
        handler: (row) => this.onEdit(row),
      },
      {
        icon: 'delete',
        label: 'Deletar',
        handler: (row) => this.onDelete(row),
      },
    ];

    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.categoryService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.items = categories;
          this.totalItems = categories.length;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  onPageChange(_event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onEdit(category: Category): void {
    console.log('Editar:', category);
  }

  onDelete(category: Category): void {
    if (confirm(`Deletar "${category.name}"?`)) {
      this.categoryService
        .deleteCategory(category.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadData();
        });
    }
  }

  getCellValue(row: any, column: ListColumn): string {
    const value = row[column.key];
    return column.formatter ? column.formatter(value, row) : value;
  }

  private truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  private formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }
}
