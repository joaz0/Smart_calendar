export type NotificationType = 'email' | 'push' | 'sms';

export interface Reminder {
  id: string;
  eventId: string;
  minutesBefore: number;
  type: NotificationType[];
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}
