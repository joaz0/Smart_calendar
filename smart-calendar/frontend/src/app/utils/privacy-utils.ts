export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const visibleChars = Math.min(3, Math.floor(username.length / 2));
  const masked = username.substring(0, visibleChars) + '*'.repeat(username.length - visibleChars);
  
  return `${masked}@${domain}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  
  const lastFour = digits.slice(-4);
  const masked = '*'.repeat(digits.length - 4) + lastFour;
  
  return masked;
}

export function anonymizeData<T extends Record<string, unknown>>(data: T, fields: (keyof T)[]): T {
  const anonymized = { ...data };
  
  for (const field of fields) {
    if (field in anonymized) {
      anonymized[field] = '[REDACTED]' as T[keyof T];
    }
  }
  
  return anonymized;
}

export function generateBackupFilename(prefix = 'backup'): string {
  const date = new Date();
  const timestamp = date.toISOString().replace(/[:.]/g, '-').split('T')[0];
  return `${prefix}_${timestamp}.json`;
}

export function encryptData(data: string, key: string): string {
  if (!data || !key) return '';
  
  try {
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

export function decryptData(encrypted: string, key: string): string {
  if (!encrypted || !key) return '';
  
  try {
    const data = atob(encrypted);
    let decrypted = '';
    for (let i = 0; i < data.length; i++) {
      decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/[<>"']/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/data:/gi, '')
    .trim();
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
