export interface BurnoutIndicator {
  id: string;
  userId: string;
  score: number; // 0-100 (higher = more burnout risk)
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: BurnoutFactor[];
  recommendations: string[];
  analyzedAt: Date;
}

export interface BurnoutFactor {
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: number; // 0-100
}

export interface BurnoutAnalysis {
  workloadScore: number;
  restScore: number;
  stressScore: number;
  balanceScore: number;
  overallRisk: number;
}
