export interface ContactIntegration {
  id: string;
  userId: string;
  provider: 'google' | 'microsoft' | 'apple' | 'manual';
  contactId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  company?: string;
  position?: string;
  tags: string[];
  lastInteraction?: Date;
  syncEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactGroup {
  id: string;
  name: string;
  contacts: string[]; // contact IDs
  color?: string;
}
