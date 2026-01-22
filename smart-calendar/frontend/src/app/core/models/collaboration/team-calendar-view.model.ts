export interface TeamCalendarView {
  teamId: string;
  teamName: string;
  members: TeamMember[];
  sharedEvents: string[]; // event IDs
  permissions: TeamPermissions;
  settings: TeamCalendarSettings;
}

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  availability: 'available' | 'busy' | 'away';
  color: string;
  joinedAt: Date;
}

export interface TeamPermissions {
  canCreateEvents: boolean;
  canEditEvents: boolean;
  canDeleteEvents: boolean;
  canInviteMembers: boolean;
}

export interface TeamCalendarSettings {
  visibility: 'public' | 'private' | 'team-only';
  allowExternalSharing: boolean;
  defaultEventDuration: number;
}
