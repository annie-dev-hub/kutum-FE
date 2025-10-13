/**
 * Auth API Service
 * Handles authentication-related API calls
 */

import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    StandardResponse,
    UserProfile
} from '@/types/api'
import apiClient from './axios'

export const authService = {
  /**
   * Login with email or mobile
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<StandardResponse<AuthResponse>>(
      '/auth/login',
      credentials
    )
    return response.data.data
  },

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<StandardResponse<AuthResponse>>(
      '/auth/register',
      userData
    )
    return response.data.data
  },

  /**
   * Get current authenticated user profile
   */
  async me(): Promise<UserProfile> {
    const response = await apiClient.get<StandardResponse<UserProfile>>('/auth/me')
    return response.data.data
  },
}

