import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService, ApiResponse } from '../api.service';

export interface DailySummary {
  id?: string;
  date: string;
  summary: string;
  actionItems: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}

@Injectable({
  providedIn: 'root'
})
export class AiSummaryService {
  private endpoint = 'ai/summary';

  constructor(private apiService: ApiService) {}

  /**
   * Obtém o resumo diário gerado por IA
   */
  getDailySummary(date: string): Observable<DailySummary | null> {
    // O Generic <DailySummary> informa ao ApiService o tipo do campo 'data'
    return this.apiService.get<DailySummary>(`${this.endpoint}?date=${date}`).pipe(
      map((response: ApiResponse<DailySummary>) => {
        // Retorna o objeto data direto
        return response.data || null;
      }),
      catchError((error) => {
        console.error('Erro ao buscar resumo IA:', error);
        // Retorna null amigável em vez de quebrar a tela
        return of(null);
      })
    );
  }

  /**
   * Força a geração de um novo resumo
   */
  generateSummary(context: any): Observable<DailySummary> {
    return this.apiService.post<DailySummary>(`${this.endpoint}/generate`, context).pipe(
      map(response => response.data!)
    );
  }
}
