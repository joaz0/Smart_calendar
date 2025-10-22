export const oauthConfig = {
  google: {
    clientId: 'SEU_GOOGLE_CLIENT_ID_AQUI', // Substitua pelo seu Google Client ID
    redirectUri: 'http://localhost:4200/auth/callback/google'
  },
  microsoft: {
    clientId: 'SEU_MICROSOFT_CLIENT_ID_AQUI', // Substitua pelo seu Microsoft Client ID
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: 'http://localhost:4200/auth/callback/microsoft'
  }
};