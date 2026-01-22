export interface AvailabilityStatus {
  userId: string;
  status: 'available' | 'busy' | 'away' | 'do-not-disturb' | 'offline';
  customMessage?: string;
  until?: Date;
  currentActivity?: string;
  nextAvailable?: Date;
  updatedAt: Date;
}

export interface AvailabilitySchedule {
  userId: string;
  dayOfWeek: number; // 0-6
  timeSlots: AvailabilitySlot[];
}

export interface AvailabilitySlot {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: 'available' | 'busy';
}
