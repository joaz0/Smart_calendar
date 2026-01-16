export interface SemanticSearchResult {
  id: string;
  type: 'event' | 'task' | 'note' | 'contact';
  title: string;
  description?: string;
  relevanceScore: number; // 0-100
  matchedTerms: string[];
  context: string;
  date?: Date;
  metadata: Record<string, unknown>;
}

export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
}

export interface SearchFilters {
  types?: string[];
  dateRange?: { start: Date; end: Date };
  categories?: string[];
  tags?: string[];
}
