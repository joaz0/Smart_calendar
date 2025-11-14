import { Router } from 'express';
import { DailySummaryService } from '../services/daily-summary.service';

const router = Router();
const summaryService = new DailySummaryService();

router.get('/today', async (req, res) => {
  const userId = (req as any).user.id;
  const summary = await summaryService.generateDailySummary(userId, new Date());
  res.json({ summary });
});

router.get('/:date', async (req, res) => {
  const userId = (req as any).user.id;
  const { date } = req.params;
  const summary = await summaryService.generateDailySummary(userId, new Date(date));
  res.json({ summary });
});

export default router;
