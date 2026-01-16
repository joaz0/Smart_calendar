export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
}

export function prepareTimeSeriesData(
  data: { date: Date; value: number }[],
  groupBy: 'day' | 'week' | 'month' = 'day'
): ChartData {
  const grouped = groupDataByPeriod(data, groupBy);
  
  return {
    labels: Object.keys(grouped),
    datasets: [{
      label: 'Valor',
      data: Object.values(grouped),
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB'
    }]
  };
}

export function groupDataByPeriod(
  data: { date: Date; value: number }[],
  period: 'day' | 'week' | 'month'
): Record<string, number> {
  const grouped: Record<string, number> = {};
  
  data.forEach(item => {
    const key = formatPeriodKey(item.date, period);
    grouped[key] = (grouped[key] || 0) + item.value;
  });
  
  return grouped;
}

export function formatPeriodKey(date: Date, period: 'day' | 'week' | 'month'): string {
  const d = new Date(date);
  
  switch (period) {
    case 'day':
      {
      return `${d.getDate()}/${d.getMonth() + 1}`;
    case 'week':
      {
      const weekNum = getWeekNumber(d);
      return `Sem ${weekNum}`;
    case 'month':
      {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return months[d.getMonth()];
  }
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function generateColorGradient(startColor: string, endColor: string, steps: number): string[] {
  const colors: string[] = [];
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    colors.push(interpolateColor(startColor, endColor, ratio));
  }
  
  return colors;
}

function interpolateColor(color1: string, color2: string, ratio: number): string {
  const hex = (x: string) => parseInt(x, 16);
  const r1 = hex(color1.slice(1, 3));
  const g1 = hex(color1.slice(3, 5));
  const b1 = hex(color1.slice(5, 7));
  const r2 = hex(color2.slice(1, 3));
  const g2 = hex(color2.slice(3, 5));
  const b2 = hex(color2.slice(5, 7));
  
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
