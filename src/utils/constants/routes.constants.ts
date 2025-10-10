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

