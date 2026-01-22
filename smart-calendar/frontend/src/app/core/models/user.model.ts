export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Opcional no modelo, mas necessário no registro
  avatar?: string;
  preferences?: UserPreferences;
  created_at: Date;
  updated_at: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  timeZone: string;
  calendarView: 'day' | 'week' | 'month';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  privacySettings: PrivacySettings;
}

export interface PrivacySettings {
  shareCalendar: boolean;
  shareAvailability: boolean;
  showRealNames: boolean;
  allowDataCollection: boolean;
  allowAIFeatures: boolean;
}
