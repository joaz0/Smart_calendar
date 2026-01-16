import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface SearchResult {
  id: string;
  type: 'event' | 'task' | 'person' | 'document' | 'note';
  title: string;
  snippet: string;
  relevanceScore: number;
  metadata?: any;
}

export interface SearchFacet {
  field: string;
  values: { value: string; count: number }[];
}

export interface SemanticQuery {
  query: string;
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'entity' | 'action';
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class SemanticSearchService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/search`;

  constructor(private http: HttpClient) {}

  search(query: SemanticQuery): Observable<{ results: SearchResult[]; facets: SearchFacet[]; total: number }> {
    return this.http.post<any>(`${this.apiUrl}/semantic`, query).pipe(
      catchError(() => of(this.getMockSearchResults(query.query)))
    );
  }

  quickSearch(query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${this.apiUrl}/quick`, { params: { q: query } }).pipe(
      catchError(() => of(this.getMockQuickResults(query)))
    );
  }

  getSuggestions(partialQuery: string): Observable<SearchSuggestion[]> {
    return this.http.get<SearchSuggestion[]>(`${this.apiUrl}/suggestions`, { params: { q: partialQuery } }).pipe(
      catchError(() => of(this.getMockSuggestions(partialQuery)))
    );
  }

  findSimilar(itemId: string, itemType: string): Observable<SearchResult[]> {
    return this.http.post<SearchResult[]>(`${this.apiUrl}/similar`, { itemId, itemType }).pipe(
      catchError(() => of(this.getMockSimilarResults()))
    );
  }

  searchByContext(context: { date?: Date; location?: string; people?: string[] }): Observable<SearchResult[]> {
    return this.http.post<SearchResult[]>(`${this.apiUrl}/context`, context).pipe(
      catchError(() => of(this.getMockContextResults()))
    );
  }

  advancedSearch(criteria: {
    keywords?: string[];
    dateRange?: { start: Date; end: Date };
    types?: string[];
    tags?: string[];
    priority?: string[];
  }): Observable<{ results: SearchResult[]; total: number }> {
    return this.http.post<any>(`${this.apiUrl}/advanced`, criteria).pipe(
      catchError(() => of({ results: this.getMockQuickResults(''), total: 5 }))
    );
  }

  private getMockSearchResults(query: string): { results: SearchResult[]; facets: SearchFacet[]; total: number } {
    return {
      results: this.getMockQuickResults(query),
      facets: [
        {
          field: 'type',
          values: [
            { value: 'event', count: 12 },
            { value: 'task', count: 8 },
            { value: 'document', count: 5 }
          ]
        },
        {
          field: 'date',
          values: [
            { value: 'today', count: 3 },
            { value: 'this_week', count: 10 },
            { value: 'this_month', count: 12 }
          ]
        }
      ],
      total: 25
    };
  }

  private getMockQuickResults(query: string): SearchResult[] {
    return [
      {
        id: '1',
        type: 'event',
        title: 'Reunião de Planejamento',
        snippet: `Reunião para discutir ${query || 'próximos passos do projeto'}`,
        relevanceScore: 0.95,
        metadata: { date: new Date(), location: 'Sala 3' }
      },
      {
        id: '2',
        type: 'task',
        title: 'Implementar feature de busca',
        snippet: 'Desenvolver busca semântica para melhorar experiência',
        relevanceScore: 0.88,
        metadata: { priority: 'high', status: 'in_progress' }
      },
      {
        id: '3',
        type: 'document',
        title: 'Especificação Técnica',
        snippet: 'Documento detalhando arquitetura e requisitos do sistema',
        relevanceScore: 0.82,
        metadata: { author: 'João Silva', updated: new Date() }
      },
      {
        id: '4',
        type: 'person',
        title: 'Maria Santos',
        snippet: 'Tech Lead - Especialista em arquitetura de sistemas',
        relevanceScore: 0.76,
        metadata: { department: 'Engineering', role: 'Tech Lead' }
      },
      {
        id: '5',
        type: 'note',
        title: 'Notas da Retrospectiva',
        snippet: 'Principais aprendizados e ações do sprint',
        relevanceScore: 0.70,
        metadata: { created: new Date(), tags: ['retrospective', 'sprint'] }
      }
    ];
  }

  private getMockSuggestions(partialQuery: string): SearchSuggestion[] {
    return [
      { text: `${partialQuery} reuniões desta semana`, type: 'query', score: 0.9 },
      { text: `${partialQuery} tarefas pendentes`, type: 'query', score: 0.85 },
      { text: `${partialQuery} João Silva`, type: 'entity', score: 0.8 },
      { text: `Criar evento: ${partialQuery}`, type: 'action', score: 0.75 }
    ];
  }

  private getMockSimilarResults(): SearchResult[] {
    return this.getMockQuickResults('similar').slice(0, 3);
  }

  private getMockContextResults(): SearchResult[] {
    return this.getMockQuickResults('context');
  }
}
