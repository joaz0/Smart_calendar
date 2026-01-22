import { Injectable, inject } from '@angular/core';
import { EntityService } from './entity.service';
import { Category } from '../models/category.model';
import { CategoryApiService } from './category-api.service';
import { Observable } from 'rxjs';
import { Logger } from '../utils/logger.component';


@Injectable({
  providedIn: 'root',
})
export class CategoryService extends EntityService<Category> {
  private categoryApiService: CategoryApiService;

  private logger = new Logger('CategoryService');

  constructor() {
    const categoryApiService = inject(CategoryApiService);

    super(categoryApiService, '/api/categories');
    this.categoryApiService = categoryApiService;

  }

  /**
   * Obter todas as categorias
   */
  getAll(page = 1, pageSize = 10): Observable<Category[]> {
    this.setLoading(true);
    return new Observable((observer) => {
      this.categoryApiService.getAllCategories(page, pageSize).subscribe({
        next: (response: unknown) => {
          const categories = (response as { data?: Category[] }).data || (response as Category[]);
          this.logger.info('Categorias carregadas', {
            count: categories.length,
          });
          this.setLoading(false);
          observer.next(categories);
          observer.complete();
        },
        error: (error) => {
          this.logger.error('Erro ao carregar categorias', error);
          this.setError(error.message || 'Erro ao carregar categorias');
          this.setLoading(false);
          observer.error(error);
        },
      });
    });
  }

  /**
   * Obter categoria por ID
   */
  getById(id: number): Observable<Category> {
    this.setLoading(true);
    return new Observable((observer) => {
      this.categoryApiService.getCategoryById(id).subscribe({
        next: (response: unknown) => {
          const category = (response as { data?: Category }).data || (response as Category);
          this.logger.info('Categoria carregada', { id });
          this.setLoading(false);
          observer.next(category);
          observer.complete();
        },
        error: (error) => {
          this.logger.error('Erro ao carregar categoria', error);
          this.setError(error.message || 'Erro ao carregar categoria');
          this.setLoading(false);
          observer.error(error);
        },
      });
    });
  }

  /**
   * Criar nova categoria
   */
  override create(category: Partial<Category>): Observable<Category> {
    this.setLoading(true);
    return new Observable((observer) => {
      this.categoryApiService.createCategory(category).subscribe({
        next: (response: unknown) => {
          const newCategory = (response as { data?: Category }).data || (response as Category);
          this.logger.info('Categoria criada', {
            id: newCategory.id,
            name: newCategory.name,
          });
          this.setLoading(false);
          observer.next(newCategory);
          observer.complete();
        },
        error: (error) => {
          this.logger.error('Erro ao criar categoria', error);
          this.setError(error.message || 'Erro ao criar categoria');
          this.setLoading(false);
          observer.error(error);
        },
      });
    });
  }

  /**
   * Atualizar categoria
   */
  override update(id: number, updates: Partial<Category>): Observable<Category> {
    this.setLoading(true);
    return new Observable((observer) => {
      this.categoryApiService.updateCategory(id, updates).subscribe({
        next: (response: unknown) => {
          const updatedCategory = (response as { data?: Category }).data || (response as Category);
          this.logger.info('Categoria atualizada', {
            id,
            name: updatedCategory.name,
          });
          this.setLoading(false);
          observer.next(updatedCategory);
          observer.complete();
        },
        error: (error) => {
          this.logger.error('Erro ao atualizar categoria', error);
          this.setError(error.message || 'Erro ao atualizar categoria');
          this.setLoading(false);
          observer.error(error);
        },
      });
    });
  }

  /**
   * Deletar categoria
   */
  override delete(id: number): Observable<void> {
    this.setLoading(true);
    return new Observable((observer) => {
      this.categoryApiService.deleteCategory(id).subscribe({
        next: () => {
          this.logger.info('Categoria deletada', { id });
          this.setLoading(false);
          observer.next();
          observer.complete();
        },
        error: (error) => {
          this.logger.error('Erro ao deletar categoria', error);
          this.setError(error.message || 'Erro ao deletar categoria');
          this.setLoading(false);
          observer.error(error);
        },
      });
    });
  }

  /**
   * Buscar categorias por nome
   */
  override search(query: string, page = 1, pageSize = 10): Observable<Category[]> {
    this.setLoading(true);
    return new Observable((observer) => {
      this.categoryApiService.searchCategories(query, page, pageSize).subscribe({
        next: (response: unknown) => {
          const categories = (response as { data?: Category[] }).data || (response as Category[]);
          this.logger.info('Categorias encontradas', {
            query,
            count: categories.length,
          });
          this.setLoading(false);
          observer.next(categories);
          observer.complete();
        },
        error: (error) => {
          this.logger.error('Erro ao buscar categorias', error);
          this.setError(error.message || 'Erro ao buscar categorias');
          this.setLoading(false);
          observer.error(error);
        },
      });
    });
  }

  /**
   * Obter categorias por cor
   */
  getByColor(_color: string): Observable<Category[]> {
    return this.getAll().pipe();
  }
}
