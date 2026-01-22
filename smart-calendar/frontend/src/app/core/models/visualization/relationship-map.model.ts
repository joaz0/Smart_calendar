export interface RelationshipMap {
  userId: string;
  nodes: RelationshipNode[];
  connections: RelationshipConnection[];
  clusters: RelationshipCluster[];
  generatedAt: Date;
}

export interface RelationshipNode {
  id: string;
  name: string;
  type: 'person' | 'team' | 'project' | 'event';
  strength: number; // 0-100
  interactions: number;
  lastInteraction: Date;
}

export interface RelationshipConnection {
  from: string;
  to: string;
  strength: number; // 0-100
  type: 'collaboration' | 'reporting' | 'social';
  frequency: number;
}

export interface RelationshipCluster {
  id: string;
  name: string;
  members: string[];
  cohesion: number; // 0-100
}
