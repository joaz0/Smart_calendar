export interface TimeAnalytics {
  totalHours: number;
  breakdown: TimeBreakdown;
  productivity: ProductivityMetrics;
  trends: TrendData[];
  insights: string[];
}

export interface TimeBreakdown {
  meetings: number;
  focusTime: number;
  breaks: number;
  personal: number;
  other: number;
}

export interface ProductivityMetrics {
  score: number;
  focusHours: number;
  completedTasks: number;
  efficiency: number;
  distractions: number;
}

export interface TrendData {
  category: string;
  change: number;
  direction: 'up' | 'down' | 'stable';
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: ChartData;
  options?: Record<string, unknown>;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}
