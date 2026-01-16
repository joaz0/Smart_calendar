import { Injectable, inject } from '@angular/core.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators.component';
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
    return this.categoryApiService.getAllCategories().pipe(
      map((response) => response.data?.data || [])
    );
  }

  getById(id: number): Observable<Category> {
    return this.categoryApiService.getCategoryById(id).pipe(
      map((response) => response.data as Category)
    );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.categoryApiService.createCategory(category as any).pipe(
      map((response) => response.data as Category)
    );
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.categoryApiService.updateCategory(id, category as any).pipe(
      map((response) => response.data as Category)
    );
  }

  deleteCategory(id: string | number): Observable<void> {
    return this.categoryApiService.deleteCategory(Number(id)).pipe(
      map(() => undefined)
    );
  }

  getByColor(color: string): Observable<Category[]> {
    return this.getAll().pipe(
      map((categories) => categories.filter((cat) => cat.color === color))
    );
  }
}
