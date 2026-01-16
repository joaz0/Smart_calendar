export const environment = {
  production: true,
  apiUrl: 'https://smart-calendar-backend-nzkf.onrender.com',
  
  // OAuth
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID',
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  oauthRedirectUri: 'https://your-app.netlify.app/auth/callback',
  
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
  cacheMaxAge: 3600000,
  offlineSyncInterval: 300000
};
