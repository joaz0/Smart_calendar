import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  private apiService = inject(ApiService);

  private readonly endpoint = '/api/categories';

  /**
   * Obter todas as categorias
   */
  getAllCategories(page = 1, limit = 50): Observable<Category[]> {
    const params = {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<Category[]>(this.endpoint, params).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao buscar categorias');
      })
    );
  }

  /**
   * Obter categoria por ID
   */
  getCategoryById(id: number): Observable<Category> {
    return this.apiService.get<Category>(`${this.endpoint}/${id}`).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Categoria não encontrada');
      })
    );
  }

  /**
   * Criar nova categoria
   */
  createCategory(request: Partial<Category>): Observable<Category> {
    return this.apiService.post<Category>(this.endpoint, request).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao criar categoria');
      })
    );
  }

  /**
   * Atualizar categoria
   */
  updateCategory(id: number, request: Partial<Category>): Observable<Category> {
    return this.apiService.put<Category>(`${this.endpoint}/${id}`, request).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao atualizar categoria');
      })
    );
  }

  /**
   * Deletar categoria
   */
  deleteCategory(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`).pipe(
      map((response) => {
        if (response.success) {
          return undefined;
        }
        throw new Error(response.error || 'Erro ao deletar categoria');
      })
    );
  }

  /**
   * Buscar categorias por nome
   */
  searchCategories(query: string, page = 1, limit = 50): Observable<Category[]> {
    const params = {
      params: {
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<Category[]>(`${this.endpoint}/search`, params).pipe(
      map((response) => {
        if (response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Erro ao buscar categorias');
      })
    );
  }
}
