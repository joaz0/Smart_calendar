import { Pipe, PipeTransform } from '@angular/core.component';

@Pipe({
  name: 'durationFormat',
  standalone: true
})
export class DurationFormatPipe implements PipeTransform {
  transform(minutes: number, format = 'short'): string {
    // Sua implementação aqui
    if (!minutes && minutes !== 0) return '';

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (format === 'short') {
      if (hours > 0 && remainingMinutes > 0) {
        return `${hours}h ${remainingMinutes}m`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else {
        return `${remainingMinutes}m`;
      }
    } else if (format === 'long') {
      if (hours > 0 && remainingMinutes > 0) {
        return `${hours} hora${hours > 1 ? 's' : ''} e ${remainingMinutes} minuto${remainingMinutes > 1 ? 's' : ''}`;
      } else if (hours > 0) {
        return `${hours} hora${hours > 1 ? 's' : ''}`;
      } else {
        return `${remainingMinutes} minuto${remainingMinutes > 1 ? 's' : ''}`;
      }
    } else if (format === 'decimal') {
      return (minutes / 60).toFixed(1) + 'h';
    }

    return minutes + 'm';
  }
}