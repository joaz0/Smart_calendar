import { Router } from 'express';
import { BurnoutDetectorService } from '../services/burnout-detector.service';

const router = Router();
const burnoutService = new BurnoutDetectorService();

router.get('/analyze', async (req, res) => {
  const userId = (req as any).user.id;
  const analysis = await burnoutService.analyzeBurnoutRisk(userId);
  res.json(analysis);
});

export default router;
