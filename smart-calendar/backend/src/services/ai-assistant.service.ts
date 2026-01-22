import { pool } from '../config/database';
import { AppConfig } from '../config/app.config';

interface ParsedEvent {
  text: string;
  detectedDate: Date | null;
  detectedTime: string | null;
  detectedDuration: number;
  participants: string[];
  location: string | null;
  category: string | null;
  confidence: number;
}

export class AIAssistantService {
  async parseNaturalLanguage(userId: number, input: string): Promise<ParsedEvent> {
    const parsed: ParsedEvent = {
      text: input,
      detectedDate: this.extractDate(input),
      detectedTime: this.extractTime(input),
      detectedDuration: this.extractDuration(input),
      participants: this.extractParticipants(input),
      location: this.extractLocation(input),
      category: this.detectCategory(input),
      confidence: 0.8
    };

    await pool.query(
      `INSERT INTO ai_parsing_log (user_id, user_input, parsed_data, confidence_score)
       VALUES ($1, $2, $3, $4)`,
      [userId, input, JSON.stringify(parsed), parsed.confidence]
    );

    return parsed;
  }

  private extractDate(text: string): Date | null {
    const today = new Date();
    const lower = text.toLowerCase();

    if (/(hoje|hj)/i.test(lower)) return today;
    if (/amanhã|amanha/i.test(lower)) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }

    const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      return new Date(parseInt(year || today.getFullYear().toString()), parseInt(month) - 1, parseInt(day));
    }

    return null;
  }

  private extractTime(text: string): string | null {
    const timeMatch = text.match(/(\d{1,2})[hH:](\d{2})?/);
    if (timeMatch) {
      const [, hour, minute = '00'] = timeMatch;
      return `${hour.padStart(2, '0')}:${minute}`;
    }
    return null;
  }

  private extractDuration(text: string): number {
    const durationMatch = text.match(/(\d+)\s*(hora|horas|h|minuto|minutos|min)/i);
    if (durationMatch) {
      const [, value, unit] = durationMatch;
      return /hora|h/i.test(unit) ? parseInt(value) * 60 : parseInt(value);
    }
    return 60;
  }

  private extractParticipants(text: string): string[] {
    const participants: string[] = [];
    const withMatch = text.match(/com\s+(o\s+|a\s+)?([A-Za-zÀ-ÿ\s]+?)(?:\s+e\s+|,|\.|$)/gi);
    if (withMatch) {
      withMatch.forEach(match => {
        const name = match.replace(/com\s+(o\s+|a\s+)?/i, '').trim();
        if (name) participants.push(name);
      });
    }
    return participants;
  }

  private extractLocation(text: string): string | null {
    const locationMatch = text.match(/(?:em|no|na)\s+([A-Za-zÀ-ÿ\s]+?)(?:\s+às|\s+as|$)/i);
    return locationMatch ? locationMatch[1].trim() : null;
  }

  private detectCategory(text: string): string | null {
    const categories: Record<string, string[]> = {
      'work': ['reunião', 'meeting', 'trabalho', 'projeto', 'cliente'],
      'personal': ['médico', 'dentista', 'academia', 'treino'],
      'social': ['jantar', 'almoço', 'café', 'encontro', 'festa']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(kw => text.toLowerCase().includes(kw))) {
        return category;
      }
    }
    return null;
  }

  async processUserCommand(userId: number, command: string, context: any) {
    if (AppConfig.isDemo) {
      console.log('🤖 [DEMO MODE] Retornando resposta mockada da IA.');
      return {
        text: 'Esta é uma resposta de demonstração. No modo produção, o Claude analisaria sua agenda real. Por enquanto, sugiro que você agende uma reunião de Review às 14h.',
        suggestedActions: [
          { type: 'schedule_event', title: 'Review de Projeto', time: '14:00' }
        ]
      };
    }

    try {
      console.log(`Processando comando para ${userId}: ${command}`);
      return {
        action: 'analyze_calendar',
        response: `Entendi, você quer ajuda com: "${command}". (Lógica de IA em desenvolvimento)`,
        entities: []
      };
    } catch (error) {
      console.error('Erro na IA:', error);
      throw error;
    }
  }

  async generateSuggestions(userId: number, context: any) {
    return [
      "Agendar reunião para amanhã",
      "Resumo da minha semana",
      "Bloquear tempo de foco"
    ];
  }

  async getHistory(userId: number) {
    const { rows } = await pool.query(
      `SELECT id, raw_text, intent, entities, confidence, created_at
       FROM ai_commands
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );

    return rows;
  }
}
