import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryApiService } from '../../../core/services/category-api.service';

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categoryApiService = inject(CategoryApiService);

  getAll(): Observable<Category[]> {
    return this.categoryApiService.getAllCategories();
  }

  getById(id: number): Observable<Category> {
    return this.categoryApiService.getCategoryById(id);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.categoryApiService.createCategory(category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.categoryApiService.updateCategory(id, category);
  }

  deleteCategory(id: string | number): Observable<void> {
    return this.categoryApiService.deleteCategory(Number(id));
  }

  getByColor(color: string): Observable<Category[]> {
    return this.getAll().pipe(
      map((categories) => categories.filter((cat) => cat.color === color))
    );
  }
}
