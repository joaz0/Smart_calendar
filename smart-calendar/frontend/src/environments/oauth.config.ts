export const oauthConfig = {
  google: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    redirectUri: 'http://localhost:4200/auth/callback/google',
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.sleep.read'
    ]
  },
  microsoft: {
    clientId: 'YOUR_MICROSOFT_CLIENT_ID',
    clientSecret: 'YOUR_MICROSOFT_CLIENT_SECRET',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: 'http://localhost:4200/auth/callback/microsoft',
    scopes: ['OnlineMeetings.ReadWrite', 'Calendars.ReadWrite']
  },
  zoom: {
    clientId: 'YOUR_ZOOM_CLIENT_ID',
    clientSecret: 'YOUR_ZOOM_CLIENT_SECRET',
    redirectUri: 'http://localhost:4200/auth/callback/zoom'
  }
};
