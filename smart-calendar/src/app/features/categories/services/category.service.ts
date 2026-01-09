import { Injectable } from '@angular/core';
import { EntityService } from '@core/services/entity.service';
import { ApiService } from '@core/services/api.service';

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
export class CategoryService extends EntityService<Category> {
  constructor(apiService: ApiService) {
    super(apiService, 'CategoryService', '/api/categories');
  }

  getByColor(color: string) {
    return this.apiService.get<Category[]>(`${this.apiEndpoint}/color/${color}`);
  }
}
