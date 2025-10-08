// Application Constants

export const APP_NAME = 'Kutum'
export const APP_VERSION = '1.0.0'

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'kutum_user',
  USERS: 'kutum_users',
  TOKEN: 'kutum_auth_token',
  LANGUAGE: 'kutum_language',
  THEME: 'kutum_theme',
  PEOPLE: 'kutum_people',
} as const

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  USER_PROFILE: '/user/profile',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/:lng',
  REGISTER: '/:lng/register',
  DASHBOARD: '/:lng/dashboard',
} as const

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const

// Supported Languages
export const LANGUAGES = {
  EN: 'en',
  HE: 'he',
} as const

// RTL Languages
export const RTL_LANGUAGES = ['he', 'ar'] as const

// Form Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MIN_NAME_LENGTH: 2,
  PHONE_PATTERN: /^[\+]?[1-9][\d]{9,15}$/,
  EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
} as const

