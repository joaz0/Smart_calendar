import { Router } from 'express';
import { n8nController } from '../controllers/n8n.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/webhook', authenticateToken, n8nController.triggerWebhook);
router.post('/workflow/:workflowId/execute', authenticateToken, n8nController.executeWorkflow);
router.get('/workflows', authenticateToken, n8nController.getWorkflows);

export default router;
