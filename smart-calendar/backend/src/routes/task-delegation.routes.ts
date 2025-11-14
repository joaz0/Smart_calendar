import { Router } from 'express';
import { TaskDelegationService } from '../services/task-delegation.service';

const router = Router();
const delegationService = new TaskDelegationService();

router.post('/:taskId/delegate', async (req, res) => {
  const { taskId } = req.params;
  const { delegateTo, message } = req.body;
  const delegatedTasks = await delegationService.delegateTask(parseInt(taskId), delegateTo, message);
  res.json(delegatedTasks);
});

router.get('/delegated', async (req, res) => {
  const userId = (req as any).user.id;
  const tasks = await delegationService.getDelegatedTasks(userId);
  res.json(tasks);
});

export default router;
