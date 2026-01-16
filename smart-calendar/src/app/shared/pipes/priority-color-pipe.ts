import { Pipe, PipeTransform } from '@angular/core.component';

@Pipe({
  name: 'priorityColor'
})
export class PriorityColorPipe implements PipeTransform {
  transform(priority: string): string {
    const colors: Record<string, string> = {
      'high': '#ef4444',    // Vermelho
      'medium': '#f59e0b',  // Amarelo/Laranja
      'low': '#10b981',     // Verde
      'none': '#6b7280'     // Cinza
    };

    return colors[priority.toLowerCase()] || colors['none'];
  }
}