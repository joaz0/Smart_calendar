/**
 * Interfaces comuns para substituir tipos 'any'
 * Smart Calendar - Type Safety
 */

// ============================================
// TIPOS GENÉRICOS
// ============================================

export type AnyObject = Record<string, unknown>;
export type AnyFunction = (...args: unknown[]) => unknown;
export type AnyArray = unknown[];

// ============================================
// HTTP & API
// ============================================

export interface HttpErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  status: number;
  statusText: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================
// FORMULÁRIOS
// ============================================

export interface FormValue {
  [key: string]: string | number | boolean | Date | null | undefined | FormValue;
}

export interface FormErrors {
  [key: string]: string | string[] | FormErrors;
}

export interface ValidationResult {
  valid: boolean;
  errors?: FormErrors;
}

// ============================================
// EVENTOS
// ============================================

export interface CustomEvent<T = unknown> {
  type: string;
  data: T;
  timestamp: Date;
}

export interface DomEvent extends Event {
  target: EventTarget & {
    value?: string;
    checked?: boolean;
  };
}

export interface KeyboardEventData {
  key: string;
  code: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

// ============================================
// COMPONENTES
// ============================================

export type ComponentData = Record<string, unknown>;

export interface ModalData {
  title?: string;
  message?: string;
  data?: unknown;
}

export interface DialogResult<T = unknown> {
  confirmed: boolean;
  data?: T;
}

// ============================================
// LISTAS & TABELAS
// ============================================

export interface ListItem {
  id: string | number;
  [key: string]: unknown;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export type FilterConfig = Record<string, string | number | boolean | Date | null>;

// ============================================
// ESTADO & STORE
// ============================================

export type AppState = Record<string, unknown>;

export interface Action<T = unknown> {
  type: string;
  payload?: T;
}

export interface StateUpdate<T = unknown> {
  previous: T;
  current: T;
}

// ============================================
// CONFIGURAÇÕES
// ============================================

export interface AppConfig {
  [key: string]: string | number | boolean | AppConfig;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  notifications?: boolean;
  [key: string]: unknown;
}

// ============================================
// ANALYTICS & TRACKING
// ============================================

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: AnyObject;
}

export interface TrackingData {
  eventName: string;
  properties?: AnyObject;
  timestamp: Date;
}

// ============================================
// UTILITÁRIOS
// ============================================

export interface KeyValuePair<T = unknown> {
  key: string;
  value: T;
}

export interface NameValuePair {
  name: string;
  value: unknown;
}

export interface IdNamePair {
  id: string | number;
  name: string;
}

// ============================================
// TIPOS DE CALLBACK
// ============================================

export type Callback<T = void> = (data?: T) => void;
export type AsyncCallback<T = void> = (data?: T) => Promise<void>;
export type ErrorCallback = (_error: Error) => void;
export type SuccessCallback<T = unknown> = (_result: T) => void;

// ============================================
// TIPOS DE DADOS DO SMART CALENDAR
// ============================================

export interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date | string;
  end: Date | string;
  description?: string;
  location?: string;
  category?: string;
  color?: string;
  allDay?: boolean;
  recurring?: boolean;
  [key: string]: unknown;
}

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date | string;
  categoryId?: string | number;
  tags?: string[];
  [key: string]: unknown;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  preferences?: UserPreferences;
  [key: string]: unknown;
}

export interface Category {
  id: string | number;
  name: string;
  color: string;
  icon?: string;
  userId?: string | number;
}

export interface Notification {
  id: string | number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date | string;
  read: boolean;
  actionUrl?: string;
}

// ============================================
// TIPOS DE INTEGRAÇÃO
// ============================================

export interface IntegrationConfig {
  provider: string;
  enabled: boolean;
  credentials?: AnyObject;
  settings?: AnyObject;
}

export interface OAuthCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date | string;
  scope?: string[];
}

// ============================================
// TIPOS DE IA
// ============================================

export interface AISuggestion {
  id: string;
  type: string;
  title: string;
  description?: string;
  confidence: number;
  data?: unknown;
  createdAt: Date | string;
}

export interface AIAnalysis {
  type: string;
  result: unknown;
  confidence: number;
  metadata?: AnyObject;
}

// ============================================
// TIPOS DE COLABORAÇÃO
// ============================================

export interface SharedCalendar {
  id: string | number;
  name: string;
  ownerId: string | number;
  sharedWith: User[];
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
}

export interface TeamMember {
  userId: string | number;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
}

// ============================================
// TIPOS DE VISUALIZAÇÃO
// ============================================

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  [key: string]: unknown;
}

export interface TimelineItem {
  id: string | number;
  title: string;
  start: Date | string;
  end?: Date | string;
  type: string;
  data?: unknown;
}

// ============================================
// TIPOS DE BEM-ESTAR
// ============================================

export interface WellnessMetric {
  type: 'stress' | 'energy' | 'focus' | 'mood';
  value: number;
  timestamp: Date | string;
  notes?: string;
}

export interface BurnoutIndicator {
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  recommendations: string[];
  score: number;
}

// ============================================
// TIPOS DE PRIVACIDADE
// ============================================

export interface PrivacySettings {
  eventCamouflage: boolean;
  offGridMode: boolean;
  shareLocation: boolean;
  shareAvailability: boolean;
  [key: string]: boolean | string | number;
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  algorithm: string;
}

// ============================================
// HTTP OPTIONS
// ============================================

export interface HttpOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  responseType?: 'json' | 'text' | 'blob';
  withCredentials?: boolean;
}

// ============================================
// OAUTH
// ============================================

export interface OAuthUserData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
  accessToken?: string;
}

// ============================================
// SCHEDULING
// ============================================

export interface ScheduledItem {
  id: string;
  time: Date;
  duration: number;
  title?: string;
}

export interface FailedItem {
  id: string;
  reason: string;
}

export interface ScheduleResult {
  scheduled: ScheduledItem[];
  failed: FailedItem[];
}

export interface Optimization {
  type: string;
  description: string;
  impact: number;
}

export interface OptimizationResult {
  optimizations: Optimization[];
  timeSaved: number;
}
