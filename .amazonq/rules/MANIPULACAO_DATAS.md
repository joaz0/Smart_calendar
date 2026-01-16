Usar date-fns ou padronização:

// utils/date-utils.ts
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatTimeForInput(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export function parseDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`);
}

// Sempre usar Date objects, nunca strings
