import { Injectable, inject } from '@angular/core.component';
import { HttpClient } from '@angular/common/http.component';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators.component';
import { environment } from '../../../../environments/environment.component';


export interface RelationshipNode {
  id: string;
  type: 'person' | 'event' | 'project' | 'task' | 'document';
  label: string;
  metadata?: any;
}

export interface RelationshipEdge {
  source: string;
  target: string;
  type: 'works_with' | 'attends' | 'owns' | 'depends_on' | 'related_to';
  strength: number;
  metadata?: any;
}

export interface RelationshipGraph {
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
}

export interface ConnectionInsight {
  nodeId: string;
  connections: number;
  centrality: number;
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RelationshipMapperService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl || 'http://localhost:3000/api'}/relationships`;

  getRelationshipGraph(focusNodeId?: string, depth = 2): Observable<RelationshipGraph> {
    return this.http.post<RelationshipGraph>(`${this.apiUrl}/graph`, { focusNodeId, depth }).pipe(
      catchError(() => of(this.getMockRelationshipGraph()))
    );
  }

  getConnectionInsights(nodeId: string): Observable<ConnectionInsight> {
    return this.http.get<ConnectionInsight>(`${this.apiUrl}/insights/${nodeId}`).pipe(
      catchError(() => of(this.getMockConnectionInsight(nodeId)))
    );
  }

  findShortestPath(sourceId: string, targetId: string): Observable<{ path: RelationshipNode[]; distance: number }> {
    return this.http.post<any>(`${this.apiUrl}/shortest-path`, { sourceId, targetId }).pipe(
      catchError(() => of({ path: [], distance: 0 }))
    );
  }

  getInfluencers(type?: string): Observable<RelationshipNode[]> {
    return this.http.get<RelationshipNode[]>(`${this.apiUrl}/influencers`, { params: { type: type || '' } }).pipe(
      catchError(() => of(this.getMockInfluencers()))
    );
  }

  suggestConnections(nodeId: string): Observable<{ node: RelationshipNode; reason: string; score: number }[]> {
    return this.http.get<any[]>(`${this.apiUrl}/suggest/${nodeId}`).pipe(
      catchError(() => of(this.getMockSuggestions()))
    );
  }

  getCollaborationNetwork(): Observable<RelationshipGraph> {
    return this.http.get<RelationshipGraph>(`${this.apiUrl}/collaboration`).pipe(
      catchError(() => of(this.getMockCollaborationNetwork()))
    );
  }

  private getMockRelationshipGraph(): RelationshipGraph {
    const nodes: RelationshipNode[] = [
      { id: 'user-1', type: 'person', label: 'Você' },
      { id: 'user-2', type: 'person', label: 'João Silva' },
      { id: 'user-3', type: 'person', label: 'Maria Santos' },
      { id: 'proj-1', type: 'project', label: 'Projeto Alpha' },
      { id: 'event-1', type: 'event', label: 'Reunião Semanal' },
      { id: 'task-1', type: 'task', label: 'Desenvolver Feature X' },
      { id: 'doc-1', type: 'document', label: 'Especificação Técnica' }
    ];

    const edges: RelationshipEdge[] = [
      { source: 'user-1', target: 'user-2', type: 'works_with', strength: 0.9 },
      { source: 'user-1', target: 'user-3', type: 'works_with', strength: 0.7 },
      { source: 'user-1', target: 'proj-1', type: 'owns', strength: 1.0 },
      { source: 'user-2', target: 'proj-1', type: 'works_with', strength: 0.8 },
      { source: 'user-1', target: 'event-1', type: 'attends', strength: 0.9 },
      { source: 'user-2', target: 'event-1', type: 'attends', strength: 0.9 },
      { source: 'user-3', target: 'event-1', type: 'attends', strength: 0.9 },
      { source: 'proj-1', target: 'task-1', type: 'related_to', strength: 1.0 },
      { source: 'task-1', target: 'doc-1', type: 'depends_on', strength: 0.8 }
    ];

    return { nodes, edges };
  }

  private getMockConnectionInsight(nodeId: string): ConnectionInsight {
    return {
      nodeId,
      connections: 12,
      centrality: 0.75,
      recommendations: [
        'Você colabora frequentemente com João - considere estabelecer reuniões regulares',
        'Maria tem expertise em área relacionada ao seu projeto',
        'Conectar-se com Pedro pode abrir novas oportunidades'
      ]
    };
  }

  private getMockInfluencers(): RelationshipNode[] {
    return [
      { id: 'inf-1', type: 'person', label: 'João Silva', metadata: { connections: 45, centrality: 0.92 } },
      { id: 'inf-2', type: 'person', label: 'Maria Santos', metadata: { connections: 38, centrality: 0.85 } },
      { id: 'inf-3', type: 'person', label: 'Pedro Costa', metadata: { connections: 32, centrality: 0.78 } }
    ];
  }

  private getMockSuggestions(): { node: RelationshipNode; reason: string; score: number }[] {
    return [
      {
        node: { id: 'sug-1', type: 'person', label: 'Ana Oliveira' },
        reason: 'Trabalha em projetos similares e conhece João Silva',
        score: 0.88
      },
      {
        node: { id: 'sug-2', type: 'person', label: 'Carlos Souza' },
        reason: 'Especialista na área de interesse e disponível para colaboração',
        score: 0.76
      },
      {
        node: { id: 'sug-3', type: 'project', label: 'Projeto Beta' },
        reason: 'Complementar ao seu projeto atual',
        score: 0.82
      }
    ];
  }

  private getMockCollaborationNetwork(): RelationshipGraph {
    return this.getMockRelationshipGraph();
  }
}
