export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const adjust = (value: number) => Math.min(255, Math.max(0, value + (value * percent / 100)));
  
  return rgbToHex(
    Math.round(adjust(rgb.r)),
    Math.round(adjust(rgb.g)),
    Math.round(adjust(rgb.b))
  );
}

export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

export function generateColorPalette(baseColor: string, count: number = 5): string[] {
  const colors: string[] = [baseColor];
  
  for (let i = 1; i < count; i++) {
    const adjustment = (i / count) * 40 - 20;
    colors.push(adjustBrightness(baseColor, adjustment));
  }
  
  return colors;
}

export function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    work: '#3B82F6',
    personal: '#10B981',
    health: '#EF4444',
    social: '#8B5CF6',
    learning: '#F59E0B',
    default: '#6B7280'
  };
  
  return colors[category.toLowerCase()] || colors['default'];
}
