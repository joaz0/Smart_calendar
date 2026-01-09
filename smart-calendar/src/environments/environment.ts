// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  logLevel: 'debug',
  apiTimeout: 30000,
  retryAttempts: 1,
  retryDelay: 1000,
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100,
  },
};
