import { Pipe, PipeTransform } from '@angular/core.component';

interface CategoryItem {
  category?: string;
  [key: string]: unknown;
}

@Pipe({
  name: 'categoryFilter',
  standalone: true
})
export class CategoryFilterPipe implements PipeTransform {
  transform(items: CategoryItem[], category: string): CategoryItem[] {
    if (!items || !category || category === 'all') {
      return items;
    }
    
    return items.filter(item => item.category === category);
  }
}
