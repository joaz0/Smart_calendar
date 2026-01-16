export function parseNaturalLanguageDate(text: string): Date | null {
  const now = new Date();
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('hoje')) {
    return now;
  }
  
  if (lowerText.includes('amanhã')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  if (lowerText.includes('próxima semana')) {
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  }
  
  // Pattern: "dia 15" or "15 de março"
  const dayPattern = /(\d{1,2})\s*(de)?\s*(\w+)?/i;
  const match = text.match(dayPattern);
  
  if (match) {
    const day = parseInt(match[1]);
    const month = match[3] ? parseMonth(match[3]) : now.getMonth();
    const date = new Date(now.getFullYear(), month, day);
    
    if (date < now) {
      date.setFullYear(date.getFullYear() + 1);
    }
    
    return date;
  }
  
  return null;
}

export function parseMonth(monthName: string): number {
  const months: Record<string, number> = {
    'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
    'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
    'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
  };
  
  return months[monthName.toLowerCase()] ?? new Date().getMonth();
}

export function parseTime(text: string): { hours: number; minutes: number } | null {
  const timePattern = /(\d{1,2}):(\d{2})|(\d{1,2})h(\d{0,2})?/i;
  const match = text.match(timePattern);
  
  if (match) {
    const hours = parseInt(match[1] || match[3]);
    const minutes = parseInt(match[2] || match[4] || '0');
    return { hours, minutes };
  }
  
  return null;
}

export function parseDuration(text: string): number | null {
  const durationPattern = /(\d+)\s*(hora|horas|minuto|minutos|h|min)/i;
  const match = text.match(durationPattern);
  
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    if (unit.startsWith('h')) {
      return value * 60;
    }
    return value;
  }
  
  return null;
}

export function extractTitle(text: string): string {
  // Remove common command words
  const cleaned = text
    .replace(/^(criar|agendar|marcar|adicionar)\s+/i, '')
    .replace(/\s+(hoje|amanhã|próxima semana|às|para|em)\s+.*/i, '')
    .trim();
  
  return cleaned || text;
}
