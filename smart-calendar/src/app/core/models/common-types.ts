// Tipos comuns para modelos de IA
export type AIMetadata = Record<string, unknown>;

export interface AIContext {
  userId?: string;
  eventId?: string;
  taskId?: string;
  timestamp?: Date;
  [key: string]: unknown;
}

export interface AITrainingData {
  input: unknown;
  output: unknown;
  metadata?: AIMetadata;
}

export interface NLPParameters {
  intent?: string;
  entities?: Record<string, unknown>;
  confidence?: number;
  [key: string]: unknown;
}

export interface SemanticSearchMetadata {
  score?: number;
  highlights?: string[];
  context?: string;
  [key: string]: unknown;
}

export interface TimeAnalyticsData {
  value: number;
  label: string;
  metadata?: Record<string, unknown>;
}
