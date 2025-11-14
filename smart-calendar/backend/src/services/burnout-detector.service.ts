import { pool } from '../config/database';

interface BurnoutAnalysis {
  riskScore: number;
  level: string;
  factors: string[];
  recommendations: string[];
}

export class BurnoutDetectorService {
  async analyzeBurnoutRisk(userId: number): Promise<BurnoutAnalysis> {
    const metrics = await this.calculateMetrics(userId);
    
    const riskScore = (
      metrics.workHoursScore * 0.3 +
      metrics.meetingDensityScore * 0.25 +
      metrics.freeTimeScore * 0.2 +
      metrics.varietyScore * 0.15 +
      metrics.sleepScore * 0.1
    );
    
    const analysis = {
      riskScore,
      level: this.getRiskLevel(riskScore),
      factors: this.identifyRiskFactors(metrics),
      recommendations: this.generateRecommendations(metrics)
    };

    await pool.query(
      `INSERT INTO burnout_analysis (user_id, analysis_date, risk_score, risk_level, factors, recommendations)
       VALUES ($1, CURRENT_DATE, $2, $3, $4, $5)
       ON CONFLICT (user_id, analysis_date) DO UPDATE 
       SET risk_score = $2, risk_level = $3, factors = $4, recommendations = $5`,
      [userId, riskScore, analysis.level, JSON.stringify(analysis.factors), JSON.stringify(analysis.recommendations)]
    );

    return analysis;
  }

  private async calculateMetrics(userId: number) {
    const { rows: [workHours] } = await pool.query(
      `SELECT COUNT(*) * 1.0 as hours FROM events 
       WHERE user_id = $1 AND start_time >= NOW() - INTERVAL '7 days' AND category_id IN (SELECT id FROM categories WHERE name = 'work')`,
      [userId]
    );

    const { rows: [meetings] } = await pool.query(
      `SELECT COUNT(*) as count FROM events 
       WHERE user_id = $1 AND start_time >= NOW() - INTERVAL '7 days' AND title ILIKE '%reunião%'`,
      [userId]
    );

    return {
      workHoursScore: Math.min((workHours?.hours || 0) / 40, 1),
      meetingDensityScore: Math.min((meetings?.count || 0) / 20, 1),
      freeTimeScore: 0.5,
      varietyScore: 0.5,
      sleepScore: 0.5
    };
  }

  private getRiskLevel(score: number): string {
    if (score < 0.3) return 'low';
    if (score < 0.6) return 'medium';
    return 'high';
  }

  private identifyRiskFactors(metrics: any): string[] {
    const factors = [];
    if (metrics.workHoursScore > 0.7) factors.push('Excesso de horas de trabalho');
    if (metrics.meetingDensityScore > 0.7) factors.push('Muitas reuniões');
    if (metrics.freeTimeScore < 0.3) factors.push('Pouco tempo livre');
    return factors;
  }

  private generateRecommendations(metrics: any): string[] {
    const recommendations = [];
    if (metrics.workHoursScore > 0.7) recommendations.push('Reduza suas horas de trabalho');
    if (metrics.meetingDensityScore > 0.7) recommendations.push('Decline reuniões desnecessárias');
    return recommendations;
  }
}
