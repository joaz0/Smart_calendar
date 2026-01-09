import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseListComponent } from '@core/components/base-list.component';
import { Category, CategoryService } from '../services/category.service';
import * as Converters from '@core/converters/converters';

export interface ListColumn {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (value: any, row?: any) => string;
  width?: string;
}

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
})
export class CategoriesListComponent extends BaseListComponent<Category> {
  constructor(private categoryService: CategoryService) {
    super('CategoriesListComponent');
  }

  protected initialize(): void {
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
        formatter: (value) => Converters.truncate(value || '', 50),
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
        formatter: (value) => Converters.formatDate(value, 'dd/MM/yyyy'),
      },
    ];

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

  protected loadData(): void {
    this.categoryService
      .getAll(this.currentPage, this.pageSize)
      .pipe(this.takeUntil())
      .subscribe((response: any) => {
        this.items = response.data;
        this.totalItems = response.total;
      });
  }

  onEdit(category: Category) {
    console.log('Editar:', category);
  }

  onDelete(category: Category) {
    if (confirm(`Deletar "${category.name}"?`)) {
      this.categoryService
        .delete(category.id)
        .pipe(this.takeUntil())
        .subscribe(() => {
          this.loadData();
        });
    }
  }
}
