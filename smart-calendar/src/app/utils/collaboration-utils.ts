export function generateShareLink(pollId: string, baseUrl: string = window.location.origin): string {
  return `${baseUrl}/polls/${pollId}`;
}

export function calculateBestTimeSlot(votes: { [slotId: string]: string[] }): string | null {
  let maxVotes = 0;
  let bestSlot: string | null = null;
  
  Object.entries(votes).forEach(([slotId, voters]) => {
    if (voters.length > maxVotes) {
      maxVotes = voters.length;
      bestSlot = slotId;
    }
  });
  
  return bestSlot;
}

export function getAvailabilityOverlap(
  schedules: Array<{ start: Date; end: Date }>
): Array<{ start: Date; end: Date }> {
  if (schedules.length === 0) return [];
  
  const overlaps: Array<{ start: Date; end: Date }> = [];
  const sorted = schedules.sort((a, b) => a.start.getTime() - b.start.getTime());
  
  let currentStart = sorted[0].start;
  let currentEnd = sorted[0].end;
  
  for (let i = 1; i < sorted.length; i++) {
    const schedule = sorted[i];
    
    if (schedule.start <= currentEnd) {
      currentEnd = new Date(Math.min(currentEnd.getTime(), schedule.end.getTime()));
    } else {
      overlaps.push({ start: currentStart, end: currentEnd });
      currentStart = schedule.start;
      currentEnd = schedule.end;
    }
  }
  
  overlaps.push({ start: currentStart, end: currentEnd });
  return overlaps;
}

export function calculateCollaborationScore(
  meetings: number,
  responses: number,
  sharedEvents: number
): number {
  const meetingScore = Math.min(meetings * 5, 40);
  const responseScore = Math.min(responses * 3, 30);
  const sharingScore = Math.min(sharedEvents * 2, 30);
  
  return Math.min(meetingScore + responseScore + sharingScore, 100);
}

export function formatParticipants(participants: string[]): string {
  if (participants.length === 0) return 'Nenhum participante';
  if (participants.length === 1) return participants[0];
  if (participants.length === 2) return `${participants[0]} e ${participants[1]}`;
  
  return `${participants[0]} e mais ${participants.length - 1}`;
}
