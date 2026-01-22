export interface EnergyLevel {
  id: string;
  userId: string;
  timestamp: Date;
  level: number; // 0-10
  context: string;
  activities: string[];
  factors: EnergyFactor[];
}

export interface EnergyFactor {
  type: 'sleep' | 'exercise' | 'nutrition' | 'stress' | 'social';
  impact: number; // -5 to +5
  description: string;
}

export interface EnergyPattern {
  userId: string;
  dayOfWeek: number;
  hourOfDay: number;
  averageLevel: number;
  consistency: number; // 0-100
}
