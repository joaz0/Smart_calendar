import { Router } from 'express';
import AiCommandsController from '../controllers/ai-commands.controller';

const router = Router();

router.get('/', (req, res) => AiCommandsController.list(req, res));
router.post('/', (req, res) => AiCommandsController.create(req, res));

export default router;
