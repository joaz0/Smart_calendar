import { Pipe, PipeTransform } from '@angular/core.component';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(_value: Date | string, format = 'medium'): string {
    if (!_value) return '';

    const date = new Date(_value);
    
    const formats: Record<string, string> = {
      // Data completa
      'full': date.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      
      // Data médio
      'medium': date.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      
      // Data curto
      'short': date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      
      // Hora apenas
      'time': date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      
      // Data e hora
      'datetime': date.toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      
      // Relativo (hoje, ontem, etc)
      'relative': this.getRelativeTime(date),
      
      // Para calendário
      'calendar': this.getCalendarFormat(date),
      
      // Apenas dia do mês
      'day': date.getDate().toString(),
      
      // Nome do mês
      'month': date.toLocaleDateString('pt-BR', { month: 'long' }),
      
      // Ano
      'year': date.getFullYear().toString()
    };

    return formats[format] || date.toLocaleDateString();
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoje';
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays === -1) {
      return 'Amanhã';
    } else if (diffDays < 7 && diffDays > 0) {
      return `Há ${diffDays} dias`;
    } else if (diffDays > -7 && diffDays < 0) {
      return `Em ${Math.abs(diffDays)} dias`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  }

  private getCalendarFormat(date: Date): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString('pt-BR', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  }
}