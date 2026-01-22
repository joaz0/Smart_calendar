export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export function generateMeetingLink(provider: 'zoom' | 'meet' | 'teams', meetingId?: string): string {
  const links = {
    zoom: `https://zoom.us/j/${meetingId || 'new'}`,
    meet: `https://meet.google.com/${meetingId || 'new'}`,
    teams: `https://teams.microsoft.com/l/meetup-join/${meetingId || 'new'}`
  };
  
  return links[provider];
}

export function parseVideoCallLink(url: string): { provider: string; meetingId: string } | null {
  const patterns = [
    { provider: 'zoom', regex: /zoom\.us\/j\/(\d+)/ },
    { provider: 'meet', regex: /meet\.google\.com\/([a-z-]+)/ },
    { provider: 'teams', regex: /teams\.microsoft\.com.*\/([a-zA-Z0-9-]+)/ }
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern.regex);
    if (match) {
      return { provider: pattern.provider, meetingId: match[1] };
    }
  }
  
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function extractDomainFromEmail(email: string): string {
  const parts = email.split('@');
  return parts.length === 2 ? parts[1] : '';
}

export function buildQueryString(params: QueryParams): string {
  const filteredParams = Object.entries(params).filter(([, value]) => 
    value !== undefined && value !== null
  );
  
  return filteredParams
    .map(([key, value]) => 
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&');
}

export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  
  queryString.replace(/^\?/, '').split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });
  
  return params;
}
