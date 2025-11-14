import { Router } from 'express';
import { SmartSchedulerService } from '../services/smart-scheduler.service';

const router = Router();
const schedulerService = new SmartSchedulerService();

router.post('/suggest-time', async (req, res) => {
  const { taskType, duration } = req.body;
  const userId = (req as any).user.id;

  const suggestions = await schedulerService.suggestOptimalTime(userId, taskType, duration);
  res.json(suggestions);
});

router.post('/find-meeting-time', async (req, res) => {
  const { participantIds, duration } = req.body;

  const optimalTime = await schedulerService.findOptimalMeetingTime(participantIds, duration);
  res.json(optimalTime);
});

export default router;
