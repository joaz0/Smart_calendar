export interface NaturalLanguageCommand {
  id?: string;
  rawText: string;
  intent?: string;
  entities?: Record<string, unknown>;
  confidence?: number; // 0-1
  timestamp?: string;
}

export default NaturalLanguageCommand;
