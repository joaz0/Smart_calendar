export interface AiSuggestion {
  id?: string;
  title: string;
  description?: string;
  score?: number; // confidence or relevance (0-1)
  tags?: string[];
  source?: 'model' | 'user' | 'integration' | string;
  createdAt?: string; // ISO date
  // optional actions that can be applied by the UI
  actions?: Array<{ type: string; payload?: any }>;
}

export default AiSuggestion;
