// Constantes da aplicação

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const JWT = {
  EXPIRES_IN: '10d',
  REFRESH_EXPIRES_IN: '30d',
};

export const RATE_LIMITS = {
  AUTH_REQUESTS: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 tentativas
  },
  API_REQUESTS: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições
  },
};

export const PASSWORD = {
  MIN_LENGTH: 8,
  SALT_ROUNDS: 12,
};

export const TIMEZONE_DEFAULT = 'America/Sao_Paulo';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
