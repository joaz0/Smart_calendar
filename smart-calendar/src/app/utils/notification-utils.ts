export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return Promise.reject('Notifications not supported');
  }
  
  return Notification.requestPermission();
}

export function showNotification(title: string, options?: NotificationOptions): void {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/assets/images/Logo_light.png',
      badge: '/assets/images/Logo_light.png',
      ...options
    });
  }
}

export function scheduleNotification(
  title: string,
  date: Date,
  options?: NotificationOptions
): number | null {
  const now = new Date();
  const delay = date.getTime() - now.getTime();
  
  if (delay <= 0) return null;
  
  return window.setTimeout(() => {
    showNotification(title, options);
  }, delay);
}

export function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `em ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  
  const hours = Math.floor(minutes / 60);
  return `em ${hours} hora${hours > 1 ? 's' : ''}`;
}

export function getNotificationIcon(type: string): string {
  const icons: { [key: string]: string } = {
    event: '📅',
    task: '✅',
    reminder: '⏰',
    break: '☕',
    meeting: '👥',
    default: '🔔'
  };
  
  return icons[type] || icons.default;
}

export function canSendNotification(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}
