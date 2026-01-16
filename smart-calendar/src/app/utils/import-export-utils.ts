export function exportToJSON<T>(data: T, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadFile(blob, filename);
}

export function exportToCSV(data: unknown[], filename: string): void {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ];
  
  const csv = csvRows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadFile(blob, filename);
}

export function exportToICalendar(events: unknown[], filename: string): void {
  const icalLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Smart Calendar//EN',
    'CALSCALE:GREGORIAN'
  ];
  
  events.forEach(event => {
    icalLines.push('BEGIN:VEVENT');
    icalLines.push(`UID:${event.id}@smartcalendar.com`);
    icalLines.push(`DTSTAMP:${formatICalDate(new Date())}`);
    icalLines.push(`DTSTART:${formatICalDate(event.startDate)}`);
    icalLines.push(`DTEND:${formatICalDate(event.endDate)}`);
    icalLines.push(`SUMMARY:${event.title}`);
    if (event.description) {
      icalLines.push(`DESCRIPTION:${event.description}`);
    }
    if (event.location) {
      icalLines.push(`LOCATION:${event.location}`);
    }
    icalLines.push('END:VEVENT');
  });
  
  icalLines.push('END:VCALENDAR');
  
  const ical = icalLines.join('\r\n');
  const blob = new Blob([ical], { type: 'text/calendar' });
  downloadFile(blob, filename);
}

function formatICalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromJSON<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function importFromCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim();
          });
          return obj;
        });
        
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid CSV file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
