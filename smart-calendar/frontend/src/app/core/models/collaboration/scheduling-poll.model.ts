export interface SchedulingPoll {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  timeSlots: TimeSlot[];
  participants: PollParticipant[];
  deadline?: Date;
  status: 'active' | 'closed' | 'finalized';
  selectedSlot?: string;
  shareLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  votes: string[]; // user IDs
  available: boolean;
}

export interface PollParticipant {
  userId: string;
  name: string;
  email: string;
  voted: boolean;
  votedAt?: Date;
}
