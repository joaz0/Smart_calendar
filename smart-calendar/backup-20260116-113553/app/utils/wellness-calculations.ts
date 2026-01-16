export function calculateBurnoutScore(
  workHours: number,
  breaksTaken: number,
  stressLevel: number,
  sleepHours: number
): number {
  const workScore = Math.min((workHours / 12) * 30, 30);
  const breakScore = Math.max(30 - (breaksTaken * 5), 0);
  const stressScore = (stressLevel / 10) * 25;
  const sleepScore = Math.max(15 - ((sleepHours / 8) * 15), 0);
  
  return Math.min(Math.round(workScore + breakScore + stressScore + sleepScore), 100);
}

export function calculateWellnessScore(
  sleepHours: number,
  stressLevel: number,
  energyLevel: number,
  exerciseMinutes: number,
  breaksTaken: number
): number {
  const sleepScore = Math.min((sleepHours / 8) * 25, 25);
  const stressScore = ((10 - stressLevel) / 10) * 20;
  const energyScore = (energyLevel / 10) * 20;
  const exerciseScore = Math.min((exerciseMinutes / 30) * 20, 20);
  const breakScore = Math.min(breaksTaken * 3, 15);
  
  return Math.min(Math.round(sleepScore + stressScore + energyScore + exerciseScore + breakScore), 100);
}

export function getStressLevel(score: number): 'low' | 'medium' | 'high' {
  if (score <= 3) return 'low';
  if (score <= 7) return 'medium';
  return 'high';
}

export function getBurnoutLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score < 25) return 'low';
  if (score < 50) return 'medium';
  if (score < 75) return 'high';
  return 'critical';
}

export function calculateEnergyTrend(levels: number[]): 'improving' | 'stable' | 'declining' {
  if (levels.length < 2) return 'stable';
  
  const recent = levels.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const previous = levels.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
  
  if (recent > previous + 1) return 'improving';
  if (recent < previous - 1) return 'declining';
  return 'stable';
}

export function suggestBreakDuration(workMinutes: number): number {
  if (workMinutes < 60) return 5;
  if (workMinutes < 120) return 10;
  if (workMinutes < 240) return 15;
  if (workMinutes < 360) return 20;
  return 30;
}

export function calculateProductivityScore(
  tasksCompleted: number,
  tasksTotal: number,
  focusHours: number,
  distractions: number
): number {
  if (tasksTotal === 0) return 0;
  
  const completionRate = (tasksCompleted / tasksTotal) * 40;
  const focusScore = Math.min((focusHours / 8) * 40, 40);
  const distractionPenalty = Math.min(distractions * 2, 20);
  
  return Math.max(0, Math.min(Math.round(completionRate + focusScore - distractionPenalty), 100));
}
