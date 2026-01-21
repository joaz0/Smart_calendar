import { Request, Response } from 'express';
import { AIAssistantService } from '../services/ai-assistant.service';
import { sendSuccess, sendError } from '../utils/response-formatter'; // Importação corrigida

export class AiCommandsController {
  private aiService: AIAssistantService;

  constructor() {
    this.aiService = new AIAssistantService();
  }

  /**
   * Processa um comando de linguagem natural enviado pelo usuário
   */
  processCommand = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { command, context } = req.body;
      const userId = (req.user as { id: number })?.id;

      if (!command) {
        // Correção: Envia res, mensagem e status code 400
        return sendError(res, 'O comando é obrigatório', 400);
      }

      if (!userId) {
        // Correção: Envia res, mensagem e status code 401
        return sendError(res, 'Usuário não autenticado', 401);
      }

      const result = await this.aiService.processUserCommand(userId, command, context);

      // Correção: Usa sendSuccess passando res e o resultado
      // O quarto parâmetro é opcional para metadados (como mensagens extras)
      return sendSuccess(res, result, 200, { message: 'Comando processado com sucesso' });

    } catch (error) {
      console.error('Erro ao processar comando de IA:', error);
      // Correção: Envia erro 500 (padrão da função se omitido, mas explicito aqui)
      return sendError(res, 'Falha interna ao processar comando', 500, error);
    }
  };

  /**
   * Gera sugestões de comandos baseados no contexto atual
   */
  getCommandSuggestions = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const userId = req.user?.id;
      const { currentScreen, timeOfDay } = req.body;

      if (!userId) {
        return sendError(res, 'Usuário não autenticado', 401);
      }

      const suggestions = await this.aiService.generateSuggestions(userId, { currentScreen, timeOfDay });

      return sendSuccess(res, suggestions, 200, { message: 'Sugestões geradas' });

    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      return sendError(res, 'Erro ao obter sugestões');
    }
  };

  /**
   * Recupera o histórico de comandos do usuário
   */
  getCommandHistory = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 'Usuário não autenticado', 401);
      }

      const history = await this.aiService.getHistory(userId);

      return sendSuccess(res, history);

    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return sendError(res, 'Erro ao recuperar histórico');
    }
  };
}
