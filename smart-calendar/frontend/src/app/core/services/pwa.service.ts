import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}


@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private updateAvailableSubject = new BehaviorSubject<boolean>(false);
  updateAvailable$ = this.updateAvailableSubject.asObservable();

  private installPromptSubject = new BehaviorSubject<BeforeInstallPromptEvent | null>(null);
  installPrompt$ = this.installPromptSubject.asObservable();

  constructor() {
    this.initServiceWorker();
    this.initInstallPrompt();
  }

  private initServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  this.updateAvailableSubject.next(true);
                }
              });
            }
          });
        })
        .catch(error => console.error('Service Worker registration failed:', error));
    }
  }

  private initInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPromptSubject.next(e);
    });
  }

  async installApp(): Promise<boolean> {
    const prompt = this.installPromptSubject.value;
    if (!prompt) return false;

    prompt.prompt();
    const result = await prompt.userChoice;
    
    if (result.outcome === 'accepted') {
      this.installPromptSubject.next(null);
      return true;
    }
    return false;
  }

  updateApp(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }
    return Notification.requestPermission();
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(
        'YOUR_VAPID_PUBLIC_KEY' // Replace with actual VAPID key
      )
    });

    return subscription;
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true);
  }
}
