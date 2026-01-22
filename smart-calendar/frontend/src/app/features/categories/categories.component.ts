import { Component } from '@angular/core';

import { CategoriesListComponent } from './components/categories-list.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [CategoriesListComponent],
})
export class CategoriesComponent {}
