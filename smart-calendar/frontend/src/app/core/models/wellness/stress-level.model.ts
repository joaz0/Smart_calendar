export interface StressLevel {
  id: string;
  userId: string;
  level: number; // 0-10
  timestamp: Date;
  triggers: string[];
  symptoms: string[];
  context?: string;
  heartRate?: number;
  activities: string[];
}

export interface StressPattern {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  averageLevel: number;
  peakTimes: string[];
  commonTriggers: string[];
  trend: 'improving' | 'stable' | 'worsening';
}
