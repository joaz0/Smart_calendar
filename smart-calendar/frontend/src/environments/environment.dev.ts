export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  logLevel: 'debug',
  apiTimeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100,
  },
  features: {
    aiEnabled: true,
    analyticsEnabled: true,
    notificationsEnabled: true,
  },
  debugMode: true,
};
