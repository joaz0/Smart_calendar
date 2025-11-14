import { Router } from 'express';
import { FocusModeService } from '../services/focus-mode.service';

const router = Router();
const focusModeService = new FocusModeService();

router.post('/activate', async (req, res) => {
  const { eventId, endTime } = req.body;
  const userId = (req as any).user.id;

  const session = await focusModeService.activateFocusMode(userId, eventId, new Date(endTime));
  res.json(session);
});

router.post('/deactivate', async (req, res) => {
  const userId = (req as any).user.id;
  await focusModeService.deactivateFocusMode(userId);
  res.json({ success: true });
});

router.get('/active', async (req, res) => {
  const userId = (req as any).user.id;
  const session = await focusModeService.getActiveFocusSession(userId);
  res.json(session);
});

export default router;
