export interface WellnessMetric {
  id: string;
  userId: string;
  date: Date;
  sleepHours?: number;
  stressLevel: number; // 0-10
  energyLevel: number; // 0-10
  moodScore: number; // 0-10
  exerciseMinutes?: number;
  breaksTaken: number;
  screenTimeHours?: number;
  hydrationLevel?: number; // 0-10
  overallScore: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface WellnessTrend {
  period: 'day' | 'week' | 'month';
  averageStress: number;
  averageEnergy: number;
  averageMood: number;
  totalBreaks: number;
  improvement: number; // percentage
}
