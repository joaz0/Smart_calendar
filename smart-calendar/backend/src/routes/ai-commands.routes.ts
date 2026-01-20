import { Router } from 'express';
import { AiCommandsController } from '../controllers/ai-commands.controller';
import { authMiddleware } from '../middleware/auth'; // Garantindo segurança

const router = Router();
const controller = new AiCommandsController();

// Rota principal para processar comandos de linguagem natural
// POST /api/ai/commands/process
router.post('/process', authMiddleware, controller.processCommand);

// Rota para buscar sugestões de comandos baseados no contexto
// POST /api/ai/commands/suggestions
router.post('/suggestions', authMiddleware, controller.getCommandSuggestions);

// Rota para histórico de comandos do usuário
// GET /api/ai/commands/history
router.get('/history', authMiddleware, controller.getCommandHistory);

export default router;
