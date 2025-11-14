import { Router } from 'express';
import { WindDownService } from '../services/wind-down.service';

const router = Router();
const windDownService = new WindDownService();

router.get('/check', async (req, res) => {
  const userId = (req as any).user.id;
  const result = await windDownService.enforceWindDownRules(userId);
  res.json(result);
});

export default router;
