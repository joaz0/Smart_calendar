export interface HealthIntegration {
  id: string;
  userId: string;
  provider: 'apple-health' | 'google-fit' | 'fitbit' | 'garmin';
  connected: boolean;
  lastSync: Date;
  permissions: HealthPermission[];
  settings: HealthIntegrationSettings;
}

export interface HealthPermission {
  type: 'steps' | 'heart-rate' | 'sleep' | 'exercise' | 'calories';
  granted: boolean;
}

export interface HealthIntegrationSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  dataTypes: string[];
}

export interface HealthData {
  date: Date;
  steps?: number;
  heartRate?: number;
  sleepHours?: number;
  activeMinutes?: number;
  caloriesBurned?: number;
}
