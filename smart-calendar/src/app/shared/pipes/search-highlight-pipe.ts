import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchHighlight'
})
export class SearchHighlightPipe implements PipeTransform {

  transform(_value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
