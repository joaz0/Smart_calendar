import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  metadata?: any;
}

export interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

export interface TreemapData {
  name: string;
  value: number;
  children?: TreemapData[];
}

@Injectable({
  providedIn: 'root'
})
export class DataVisualizationService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/visualization`;

  getProductivityChart(period: { start: Date; end: Date }): Observable<ChartData> {
    return this.http.post<ChartData>(`${this.apiUrl}/productivity`, period).pipe(
      catchError(() => of(this.getMockProductivityChart()))
    );
  }

  getCategoryDistribution(period: { start: Date; end: Date }): Observable<ChartData> {
    return this.http.post<ChartData>(`${this.apiUrl}/categories`, period).pipe(
      catchError(() => of(this.getMockCategoryDistribution()))
    );
  }

  getTimeSeriesData(metric: string, period: { start: Date; end: Date }): Observable<TimeSeriesData[]> {
    return this.http.post<TimeSeriesData[]>(`${this.apiUrl}/time-series`, { metric, period }).pipe(
      catchError(() => of(this.getMockTimeSeriesData()))
    );
  }

  getHeatmapData(type: 'activity' | 'energy' | 'productivity'): Observable<HeatmapData[]> {
    return this.http.get<HeatmapData[]>(`${this.apiUrl}/heatmap/${type}`).pipe(
      catchError(() => of(this.getMockHeatmapData()))
    );
  }

  getTreemapData(category: string): Observable<TreemapData> {
    return this.http.get<TreemapData>(`${this.apiUrl}/treemap/${category}`).pipe(
      catchError(() => of(this.getMockTreemapData()))
    );
  }

  getComparisonChart(metrics: string[], period: { start: Date; end: Date }): Observable<ChartData> {
    return this.http.post<ChartData>(`${this.apiUrl}/comparison`, { metrics, period }).pipe(
      catchError(() => of(this.getMockComparisonChart()))
    );
  }

  exportChartData(chartType: string, format: 'csv' | 'json' | 'pdf'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/${chartType}`, {
      params: { format },
      responseType: 'blob'
    }).pipe(
      catchError(() => of(new Blob()))
    );
  }

  private getMockProductivityChart(): ChartData {
    return {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Produtividade',
          data: [75, 82, 68, 88, 79, 45, 30],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)'
        }
      ]
    };
  }

  private getMockCategoryDistribution(): ChartData {
    return {
      labels: ['Trabalho', 'Reuniões', 'Pessoal', 'Saúde', 'Estudo'],
      datasets: [
        {
          label: 'Distribuição de Tempo',
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ]
        }
      ]
    };
  }

  private getMockTimeSeriesData(): TimeSeriesData[] {
    const data: TimeSeriesData[] = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        timestamp: date,
        value: 60 + Math.random() * 40,
        metadata: { day: date.getDay() }
      });
    }
    
    return data;
  }

  private getMockHeatmapData(): HeatmapData[] {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const data: HeatmapData[] = [];
    
    days.forEach(day => {
      hours.forEach(hour => {
        data.push({
          x: hour,
          y: day,
          value: Math.random() * 100
        });
      });
    });
    
    return data;
  }

  private getMockTreemapData(): TreemapData {
    return {
      name: 'Atividades',
      value: 100,
      children: [
        {
          name: 'Trabalho',
          value: 45,
          children: [
            { name: 'Desenvolvimento', value: 25 },
            { name: 'Reuniões', value: 15 },
            { name: 'E-mails', value: 5 }
          ]
        },
        {
          name: 'Pessoal',
          value: 30,
          children: [
            { name: 'Exercício', value: 10 },
            { name: 'Família', value: 15 },
            { name: 'Lazer', value: 5 }
          ]
        },
        { name: 'Outros', value: 25 }
      ]
    };
  }

  private getMockComparisonChart(): ChartData {
    return {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [
        {
          label: 'Tarefas Completadas',
          data: [18, 24, 26, 29],
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        },
        {
          label: 'Horas de Foco',
          data: [22, 28, 30, 32],
          backgroundColor: 'rgba(153, 102, 255, 0.6)'
        },
        {
          label: 'Reuniões',
          data: [8, 10, 9, 7],
          backgroundColor: 'rgba(255, 159, 64, 0.6)'
        }
      ]
    };
  }
}
