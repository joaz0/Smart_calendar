export interface TimeAnalytics {
  userId: string;
  period: { start: Date; end: Date };
  totalHours: number;
  breakdown: TimeBreakdown;
  productivity: ProductivityMetrics;
  trends: TimeTrend[];
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
  score: number; // 0-100
  focusHours: number;
  distractions: number;
  completedTasks: number;
  efficiency: number; // 0-100
}

export interface TimeTrend {
  category: string;
  change: number; // percentage
  direction: 'up' | 'down' | 'stable';
}
