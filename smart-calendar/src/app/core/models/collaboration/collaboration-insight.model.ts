export interface CollaborationInsight {
  id: string;
  userId: string;
  period: 'week' | 'month' | 'quarter';
  totalMeetings: number;
  averageMeetingDuration: number;
  topCollaborators: Collaborator[];
  meetingsByType: Record<string, number>;
  productiveHours: number;
  collaborationScore: number; // 0-100
  recommendations: string[];
  generatedAt: Date;
}

export interface Collaborator {
  userId: string;
  name: string;
  meetingCount: number;
  totalHours: number;
  lastMeeting: Date;
}
