export interface DelegatedTask {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  delegatedBy: string;
  delegatedTo: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'completed';
  dueDate?: Date;
  notes?: string;
  delegatedAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
}

export interface DelegationRequest {
  taskId: string;
  delegateTo: string;
  message?: string;
  dueDate?: Date;
}
