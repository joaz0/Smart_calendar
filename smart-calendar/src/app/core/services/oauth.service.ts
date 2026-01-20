import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { oauthConfig } from '../../../environments/oauth.config';

type GoogleCredentialResponse = { credential?: string };
type GooglePromptNotification = {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
};

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  prompt: (callback: (notification: GooglePromptNotification) => void) => void;
}

interface GoogleAccountsOauth2 {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (response: unknown) => void;
  }) => { requestAccessToken: () => void };
}

interface GoogleIdentityServices {
  accounts: {
    id: GoogleAccountsId;
    oauth2: GoogleAccountsOauth2;
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
    Microsoft: Record<string, unknown>;
  }
}

@Injectable({
  providedIn: 'root'
})
export class OAuthService {

  constructor() {
    // OAuth Service initialization
  }

  initializeGoogleAuth(): Observable<unknown> {
    return from(this.loadGoogleScript().then(() => {
      return new Promise((resolve) => {
        const google = window.google;
        if (!google) {
          resolve(null);
          return;
        }
        google.accounts.id.initialize({
          client_id: oauthConfig.google.clientId,
          callback: resolve,
          auto_select: false,
          cancel_on_tap_outside: false
        });
      });
    }));
  }

  loginWithGoogle(): Observable<unknown> {
    return from(new Promise((resolve, reject) => {
      if (!window.google) {
        this.loadGoogleScript().then(() => {
          this.performGoogleLogin(resolve, reject);
        });
      } else {
        this.performGoogleLogin(resolve, reject);
      }
    }));
  }

  private performGoogleLogin(resolve: (value: unknown) => void, reject: (reason?: unknown) => void) {
    const google = window.google;
    if (!google) {
      reject('Google SDK não disponível');
      return;
    }
    google.accounts.id.initialize({
      client_id: oauthConfig.google.clientId,
      callback: (response: GoogleCredentialResponse) => {
        if (response?.credential) {
          resolve(response);
        } else {
          reject('Login cancelado');
        }
      }
    });
    
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback para popup
        google.accounts.oauth2.initTokenClient({
          client_id: oauthConfig.google.clientId,
          scope: 'email profile',
          callback: resolve
        }).requestAccessToken();
      }
    });
  }

  loginWithMicrosoft(): Observable<unknown> {
    return from(new Promise((resolve, reject) => {
      const popup = window.open(
        this.getMicrosoftAuthUrl(),
        'microsoft-login',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject('Login cancelado');
        }
      }, 1000);

      // Listen for message from popup
      window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'MICROSOFT_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup?.close();
          resolve(event.data.data);
        } else if (event.data.type === 'MICROSOFT_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup?.close();
          reject(event.data.error);
        }
      });
    }));
  }

  private getMicrosoftAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: oauthConfig.microsoft.clientId,
      response_type: 'code',
      redirect_uri: oauthConfig.microsoft.redirectUri,
      scope: 'openid profile email',
      response_mode: 'query'
    });

    return `${oauthConfig.microsoft.authority}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject('Erro ao carregar Google SDK');
      document.head.appendChild(script);
    });
  }
}
