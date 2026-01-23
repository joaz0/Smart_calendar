import { Pipe, PipeTransform } from '@angular/core';
import { STATUS_COLOR_VARS } from '../tokens/color-tokens';

@Pipe({
  name: 'priorityColor'
})
export class PriorityColorPipe implements PipeTransform {
  transform(priority: string): string {
    const colors: Record<string, string> = {
      high: STATUS_COLOR_VARS.error,
      medium: STATUS_COLOR_VARS.warning,
      low: STATUS_COLOR_VARS.success,
      none: STATUS_COLOR_VARS.neutral,
    };

    return colors[priority.toLowerCase()] || colors.none;
  }
}
