import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    google: any;
    Microsoft: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class OAuthService {
  constructor(private http: HttpClient) {}

  // Google OAuth
  async loginWithGoogle(): Promise<Observable<any>> {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject('Google SDK not loaded');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        callback: (response: any) => {
          const credential = this.parseJwt(response.credential);
          const googleData = {
            email: credential.email,
            name: credential.name,
            googleId: credential.sub,
            provider: 'google'
          };
          
          resolve(this.http.post(`${environment.apiUrl}/auth/oauth/google`, googleData));
        }
      });

      window.google.accounts.id.prompt();
    });
  }

  // Microsoft OAuth
  async loginWithMicrosoft(): Promise<Observable<any>> {
    return new Promise((resolve, reject) => {
      // Simulate Microsoft login - replace with actual Microsoft Graph SDK
      const microsoftData = {
        email: 'user@example.com',
        name: 'Microsoft User',
        microsoftId: 'microsoft_id_123',
        provider: 'microsoft'
      };
      
      resolve(this.http.post(`${environment.apiUrl}/auth/oauth/microsoft`, microsoftData));
    });
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    
    return JSON.parse(jsonPayload);
  }
}