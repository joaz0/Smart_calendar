import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';

export const categoriesRoutes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/categories-list.component').then((m) => m.CategoriesListComponent),
      },
    ],
  },
];
