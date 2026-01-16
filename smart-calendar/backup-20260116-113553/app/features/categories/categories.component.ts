import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { CategoriesListComponent } from './components/categories-list.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [CategoriesListComponent],
})
export class CategoriesComponent {}
