import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchHighlight'
})
export class SearchHighlightPipe implements PipeTransform {

  transform(_value: any, ...args: any[]): any {
    return null;
  }

}
