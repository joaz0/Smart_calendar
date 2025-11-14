export function extractIntent(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('criar') || lowerText.includes('agendar') || lowerText.includes('marcar')) {
    return 'create_event';
  }
  if (lowerText.includes('cancelar') || lowerText.includes('remover') || lowerText.includes('deletar')) {
    return 'delete_event';
  }
  if (lowerText.includes('alterar') || lowerText.includes('mudar') || lowerText.includes('editar')) {
    return 'update_event';
  }
  if (lowerText.includes('listar') || lowerText.includes('mostrar') || lowerText.includes('ver')) {
    return 'list_events';
  }
  if (lowerText.includes('lembrar') || lowerText.includes('notificar')) {
    return 'set_reminder';
  }
  
  return 'unknown';
}

export function extractEntities(text: string): { [key: string]: any } {
  const entities: { [key: string]: any } = {};
  
  // Extract dates
  const datePatterns = [
    /amanhã/i,
    /hoje/i,
    /próxima semana/i,
    /\d{1,2}\/\d{1,2}/,
    /\d{1,2} de \w+/i
  ];
  
  datePatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) entities.date = match[0];
  });
  
  // Extract times
  const timePattern = /\d{1,2}:\d{2}|\d{1,2}h\d{0,2}/g;
  const times = text.match(timePattern);
  if (times) entities.time = times[0];
  
  // Extract duration
  const durationPattern = /(\d+)\s*(hora|horas|minuto|minutos|h|min)/i;
  const duration = text.match(durationPattern);
  if (duration) entities.duration = duration[0];
  
  return entities;
}

export function calculateConfidence(intent: string, entities: { [key: string]: any }): number {
  let confidence = 0.5;
  
  if (intent !== 'unknown') confidence += 0.3;
  if (Object.keys(entities).length > 0) confidence += 0.1 * Object.keys(entities).length;
  
  return Math.min(confidence, 1.0);
}

export function generateSuggestion(context: any): string {
  const { events, tasks, habits } = context;
  
  if (events?.length > 5) {
    return 'Você tem muitos eventos hoje. Considere reagendar alguns para manter o foco.';
  }
  if (tasks?.filter((t: any) => !t.completed).length > 10) {
    return 'Você tem muitas tarefas pendentes. Priorize as mais importantes.';
  }
  if (habits?.streak < 3) {
    return 'Continue com seus hábitos! Você está no caminho certo.';
  }
  
  return 'Seu dia está bem organizado!';
}
