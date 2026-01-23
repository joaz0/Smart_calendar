import { Entity } from '../models/common-interfaces';

export interface TeamMember extends Entity {
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer' | 'editor';
  avatar?: string;
  status: 'online' | 'offline' | 'busy' | 'away' | 'in_meeting';
  availability: {
    start: string;
    end: string;
  };
  lastActive?: Date;
}

export interface SharedEvent extends Entity {
  title: string;
  start: Date;
  end: Date;
  attendees: string[];
  organizer: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  type: 'meeting' | 'deadline' | 'milestone' | 'other' | 'pair_programming' | 'review';
}

export interface TaskDelegation extends Entity {
  taskId: string;
  taskTitle: string;
  fromUser: string;
  toUser: string;
  delegatedAt: Date;
  dueDate: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  message?: string;
}

export interface CollaborationStats {
  totalMembers: number;
  activeMembers: number;
  sharedEvents: number;
  pendingDelegations: number;
  completedTasks: number;
  tasksCompletedToday?: number;
  upcomingMeetings?: number;
  teamVelocity?: number;
}

export interface TeamUpdate {
  id: string;
  message: string;
  authorId: string;
  timestamp: Date;
  type: 'status' | 'task' | 'event';
}
