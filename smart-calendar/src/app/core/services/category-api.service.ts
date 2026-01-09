import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';
import { Category } from '../models/category.model';

interface CreateCategoryRequest {
  name: string;
  color?: string;
  description?: string;
}

interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

interface CategoryListResponse {
  data: Category[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  private readonly endpoint = '/api/categories';

  constructor(private apiService: ApiService) {}

  /**
   * Obter todas as categorias
   */
  getAllCategories(page = 1, limit = 50): Observable<CategoryListResponse> {
    const params = {
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<CategoryListResponse>(this.endpoint, params);
  }

  /**
   * Obter categoria por ID
   */
  getCategoryById(id: number): Observable<ApiResponse<Category>> {
    return this.apiService.get<ApiResponse<Category>>(`${this.endpoint}/${id}`);
  }

  /**
   * Criar nova categoria
   */
  createCategory(request: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.apiService.post<ApiResponse<Category>>(this.endpoint, request);
  }

  /**
   * Atualizar categoria
   */
  updateCategory(id: number, request: UpdateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.apiService.put<ApiResponse<Category>>(`${this.endpoint}/${id}`, request);
  }

  /**
   * Deletar categoria
   */
  deleteCategory(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  /**
   * Buscar categorias por nome
   */
  searchCategories(query: string, page = 1, limit = 50): Observable<CategoryListResponse> {
    const params = {
      params: {
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      },
    };

    return this.apiService.get<CategoryListResponse>(`${this.endpoint}/search`, params);
  }
}
