import { Router } from 'express';
import AiSuggestionsController from '../controllers/ai-suggestions.controller';

const router = Router();

router.get('/', (req, res) => AiSuggestionsController.list(req, res));
router.post('/', (req, res) => AiSuggestionsController.create(req, res));

export default router;
