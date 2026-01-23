export interface ColorPalette {
  name: string;
  colors: string[];
}

export const STATUS_COLOR_VARS = {
  success: 'var(--success-500)',
  warning: 'var(--warning-500)',
  error: 'var(--error-500)',
  info: 'var(--info-500)',
  neutral: 'var(--neutral-500)',
} as const;

export const MATERIAL_COLORS = {
  blue: '#2196F3',
  green: '#4CAF50',
  orange: '#FF9800',
  red: '#F44336',
  purple: '#9C27B0',
  indigo: '#3F51B5',
  pink: '#E91E63',
  deepPurple: '#6A1B9A',
  gray: '#9E9E9E',
} as const;

export const CATEGORY_COLORS = {
  blue: '#3B82F6',
  cyan: '#06B6D4',
  green: '#10B981',
  lime: '#84CC16',
  red: '#EF4444',
  pink: '#EC4899',
  orange: '#F97316',
  amber: '#F59E0B',
  yellow: '#EAB308',
  violet: '#8B5CF6',
  purple: '#A855F7',
  indigo: '#6366F1',
  teal: '#14B8A6',
  slate: '#64748B',
  gray: '#6B7280',
  neutral: '#737373',
  stone: '#78716C',
} as const;

export const DEFAULT_CATEGORY_COLORS = {
  work: CATEGORY_COLORS.blue,
  personal: CATEGORY_COLORS.green,
  health: CATEGORY_COLORS.red,
  education: CATEGORY_COLORS.amber,
} as const;

export const CATEGORY_COLOR_OPTIONS = [
  { name: 'Azul', value: CATEGORY_COLORS.blue },
  { name: 'Azul Claro', value: CATEGORY_COLORS.cyan },
  { name: 'Verde', value: CATEGORY_COLORS.green },
  { name: 'Verde Lima', value: CATEGORY_COLORS.lime },
  { name: 'Vermelho', value: CATEGORY_COLORS.red },
  { name: 'Rosa', value: CATEGORY_COLORS.pink },
  { name: 'Laranja', value: CATEGORY_COLORS.orange },
  { name: 'Amarelo', value: CATEGORY_COLORS.yellow },
  { name: 'Roxo', value: CATEGORY_COLORS.violet },
  { name: 'Violeta', value: CATEGORY_COLORS.purple },
  { name: 'Índigo', value: CATEGORY_COLORS.indigo },
  { name: 'Ciano', value: CATEGORY_COLORS.teal },
  { name: 'Slate', value: CATEGORY_COLORS.slate },
  { name: 'Cinza', value: CATEGORY_COLORS.gray },
  { name: 'Neutro', value: CATEGORY_COLORS.neutral },
  { name: 'Pedra', value: CATEGORY_COLORS.stone },
];

export const CATEGORY_FORM_OPTIONS = [
  { label: '🔴 Vermelho', value: CATEGORY_COLORS.red },
  { label: '🔵 Azul', value: CATEGORY_COLORS.blue },
  { label: '🟢 Verde', value: CATEGORY_COLORS.green },
  { label: '🟣 Roxo', value: CATEGORY_COLORS.purple },
  { label: '🟡 Amarelo', value: CATEGORY_COLORS.amber },
];

export const COLOR_PICKER_PALETTES: ColorPalette[] = [
  {
    name: 'Principais',
    colors: [
      '#EF4444', '#F97316', '#F59E0B', '#EAB308',
      '#84CC16', '#22C55E', '#10B981', '#14B8A6',
      '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
      '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
    ],
  },
  {
    name: 'Tons Pastel',
    colors: [
      '#FCA5A5', '#FDBA74', '#FCD34D', '#FDE047',
      '#BEF264', '#86EFAC', '#6EE7B7', '#5EEAD4',
      '#7DD3FC', '#93C5FD', '#A5B4FC', '#C4B5FD',
      '#D8B4FE', '#F0ABFC', '#F9A8D4', '#FBB6CE',
    ],
  },
  {
    name: 'Tons Escuros',
    colors: [
      '#B91C1C', '#C2410C', '#B45309', '#A16207',
      '#4D7C0F', '#15803D', '#047857', '#115E59',
      '#075985', '#1E40AF', '#1E3A8A', '#3730A3',
      '#5B21B6', '#6B21A8', '#86198F', '#9F1239',
    ],
  },
  {
    name: 'Neutros',
    colors: [
      '#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0',
      '#CBD5E1', '#94A3B8', '#64748B', '#475569',
      '#334155', '#1E293B', '#0F172A', '#020617',
      '#000000', '#18181B', '#27272A', '#3F3F46',
    ],
  },
];

export const COLOR_NAME_MAP: Record<string, string> = {
  '#FFFFFF': 'Branco',
  '#000000': 'Preto',
  '#EF4444': 'Vermelho',
  '#F97316': 'Laranja',
  '#F59E0B': 'Âmbar',
  '#EAB308': 'Amarelo',
  '#84CC16': 'Lima',
  '#22C55E': 'Verde',
  '#10B981': 'Esmeralda',
  '#14B8A6': 'Verde-água',
  '#06B6D4': 'Ciano',
  '#0EA5E9': 'Azul céu',
  '#3B82F6': 'Azul',
  '#6366F1': 'Índigo',
  '#8B5CF6': 'Violeta',
  '#A855F7': 'Roxo',
  '#D946EF': 'Fúcsia',
  '#EC4899': 'Rosa',
};

export const CHART_COLORS = {
  pink: '#FF6384',
  blue: '#36A2EB',
  yellow: '#FFCE56',
  teal: '#4BC0C0',
  purple: '#9966FF',
  blueBorder: '#2563EB',
  blueFill: 'rgba(54, 162, 235, 0.2)',
} as const;

export const CHART_SERIES_COLORS = [
  CHART_COLORS.pink,
  CHART_COLORS.blue,
  CHART_COLORS.yellow,
  CHART_COLORS.teal,
  CHART_COLORS.purple,
] as const;

export const HABIT_STREAK_COLORS = {
  intense: '#FF6B00',
  strong: '#FF9800',
  mild: '#FFC107',
} as const;

export const POMODORO_MODE_COLORS = {
  work: MATERIAL_COLORS.pink,
  shortBreak: MATERIAL_COLORS.green,
  longBreak: MATERIAL_COLORS.blue,
  idle: MATERIAL_COLORS.gray,
} as const;

export const TEMPLATE_CATEGORY_COLORS = {
  work: MATERIAL_COLORS.blue,
  personal: MATERIAL_COLORS.purple,
  health: MATERIAL_COLORS.green,
  social: MATERIAL_COLORS.pink,
  education: MATERIAL_COLORS.indigo,
  other: MATERIAL_COLORS.gray,
} as const;

export const DEFAULT_EVENT_COLOR = CATEGORY_COLORS.blue;
