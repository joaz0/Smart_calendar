import { Component } from '@angular/core.component';

import { RouterOutlet } from '@angular/router.component';
import { CategoriesListComponent } from './components/categories-list.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [CategoriesListComponent],
})
export class CategoriesComponent {}
