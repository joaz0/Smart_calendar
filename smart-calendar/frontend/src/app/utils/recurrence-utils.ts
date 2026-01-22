import { Recurrence } from '../core/models/recurrence.model';

export function generateRecurrenceDates(
  startDate: Date,
  recurrence: Recurrence,
  count = 10
): Date[] {
  const dates: Date[] = [startDate];
  let currentDate = new Date(startDate);
  
  for (let i = 1; i < count; i++) {
    switch (recurrence.frequency) {
      case 'daily': {
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + (recurrence.interval || 1));
        break;
      }
      case 'weekly': {
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + (7 * (recurrence.interval || 1)));
        break;
      }
      case 'monthly': {
        currentDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + (recurrence.interval || 1));
        break;
      }
      case 'yearly': {
        currentDate = new Date(currentDate);
        currentDate.setFullYear(currentDate.getFullYear() + (recurrence.interval || 1));
        break;
      }
    }
    
    if (recurrence.endDate && currentDate > recurrence.endDate) break;
    dates.push(new Date(currentDate));
  }
  
  return dates;
}

export function getNextOccurrence(startDate: Date, recurrence: Recurrence): Date | null {
  const now = new Date();
  if (startDate > now) return startDate;
  
  const dates = generateRecurrenceDates(startDate, recurrence, 100);
  return dates.find(date => date > now) || null;
}

export function formatRecurrence(recurrence: Recurrence): string {
  const interval = recurrence.interval || 1;
  const freq = recurrence.frequency;
  
  if (interval === 1) {
    const labels: Record<string, string> = {
      daily: 'Diariamente',
      weekly: 'Semanalmente',
      monthly: 'Mensalmente',
      yearly: 'Anualmente'
    };
    return labels[freq] || freq;
  }
  
  const labels: Record<string, string> = {
    daily: 'dias',
    weekly: 'semanas',
    monthly: 'meses',
    yearly: 'anos'
  };
  
  return `A cada ${interval} ${labels[freq] || freq}`;
}

export function isRecurringEvent(recurrence?: Recurrence): boolean {
  return !!recurrence && !!recurrence.frequency;
}
