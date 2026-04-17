export const BASE_URL = 'http://localhost:8085';

export const API_ERROR_TYPES = {
  NETWORK: 'network',
  HTTP: 'http',
  VALIDATION: 'validation',
  SERVER: 'server',
  PARSE: 'parse',
  TIMEOUT: 'timeout'
} as const;
