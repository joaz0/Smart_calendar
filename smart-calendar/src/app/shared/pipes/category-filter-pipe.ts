import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryFilter'
})
export class CategoryFilterPipe implements PipeTransform {

  transform(_value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
