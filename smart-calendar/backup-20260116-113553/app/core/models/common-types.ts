// Tipos comuns para modelos de IA
export type AIMetadata = Record<string, unknown>;

export interface AIContext {
  userId?: string;
  eventId?: string;
  taskId?: string;
  timestamp?: Date;
  [key: string]: any;
}

export interface AITrainingData {
  input: any;
  output: any;
  metadata?: AIMetadata;
}

export interface NLPParameters {
  intent?: string;
  entities?: Record<string, unknown>;
  confidence?: number;
  [key: string]: any;
}

export interface SemanticSearchMetadata {
  score?: number;
  highlights?: string[];
  context?: string;
  [key: string]: any;
}

export interface TimeAnalyticsData {
  value: number;
  label: string;
  metadata?: Record<string, unknown>;
}
