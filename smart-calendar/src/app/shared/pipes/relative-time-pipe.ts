import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

  transform(_value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
