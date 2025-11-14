import { Router } from 'express';
import { SchedulingPollsService } from '../services/scheduling-polls.service';

const router = Router();
const pollsService = new SchedulingPollsService();

router.post('/', async (req, res) => {
  const { title, timeSlots, durationMinutes } = req.body;
  const organizerId = (req as any).user.id;
  const poll = await pollsService.createPoll(organizerId, title, timeSlots, durationMinutes);
  res.json(poll);
});

router.post('/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { preferredSlots } = req.body;
  const userId = (req as any).user.id;
  const vote = await pollsService.vote(parseInt(id), userId, preferredSlots);
  res.json(vote);
});

router.get('/:id/results', async (req, res) => {
  const { id } = req.params;
  const results = await pollsService.getResults(parseInt(id));
  res.json(results);
});

export default router;
