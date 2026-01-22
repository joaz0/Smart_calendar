export interface ProjectTimeline {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  tasks: TimelineTask[];
  progress: number; // 0-100
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
}

export interface Milestone {
  id: string;
  name: string;
  date: Date;
  completed: boolean;
  description?: string;
}

export interface TimelineTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  assignee?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dependencies: string[]; // task IDs
}
