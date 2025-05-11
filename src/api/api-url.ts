import { apiUrl } from '@/types/environment';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${apiUrl}/auth/login`,
    LOGOUT: `${apiUrl}/auth/logout`,
  },
  CATEGORIES: `${apiUrl}/categories`,
  RADIOGRAPH: {
    GET: `${apiUrl}/radiograph/data`,
    PREDICT: `${apiUrl}/radiograph/predict`,
    DELETE_BULK: `${apiUrl}/radiograph/bulk`,
    DELETE: `${apiUrl}/radiograph`,
  },
} as const;