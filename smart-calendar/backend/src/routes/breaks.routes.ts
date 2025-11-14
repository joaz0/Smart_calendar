import { Router } from 'express';
import { ActiveBreaksService } from '../services/active-breaks.service';

const router = Router();
const breaksService = new ActiveBreaksService();

router.post('/schedule', async (req, res) => {
  const { date } = req.body;
  const userId = (req as any).user.id;
  const breaks = await breaksService.scheduleSmartBreaks(userId, new Date(date));
  res.json(breaks);
});

export default router;
