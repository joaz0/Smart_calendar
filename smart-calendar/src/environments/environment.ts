export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  
  // OAuth
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID',
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  oauthRedirectUri: 'http://localhost:4200/auth/callback',
  
  // Video Conference
  zoomClientId: 'YOUR_ZOOM_CLIENT_ID',
  teamsClientId: 'YOUR_TEAMS_CLIENT_ID',
  
  // PWA
  vapidPublicKey: 'YOUR_VAPID_PUBLIC_KEY',
  
  // Features
  enableOfflineMode: true,
  enablePushNotifications: true,
  enableHealthIntegration: true,
  enableVideoConference: true,
  enableWebhooks: true,
  
  // Cache
  cacheMaxAge: 3600000, // 1 hour
  offlineSyncInterval: 300000 // 5 minutes
};
