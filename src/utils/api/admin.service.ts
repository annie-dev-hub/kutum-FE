/**
 * Admin API Service
 * Handles admin-only endpoints
 */

import type {
  AdminUser,
  AdminUsersQueryParams,
  PaginatedResponse,
  StandardResponse,
  UserFamilyMember,
} from '@/types/api'
import apiClient from './axios'

export const adminService = {
  /**
   * Get all users with pagination (admin only)
   */
  async getAllUsers(params?: AdminUsersQueryParams): Promise<PaginatedResponse<AdminUser>> {
    const response = await apiClient.get<StandardResponse<PaginatedResponse<AdminUser>>>(
      '/admin/users',
      { params }
    )
    return response.data.data
  },

  /**
   * Get specific user's family members (admin only)
   */
  async getUserFamilyMembers(userId: string): Promise<UserFamilyMember[]> {
    const response = await apiClient.get<StandardResponse<UserFamilyMember[]>>(
      `/admin/users/${userId}/family`
    )
    return response.data.data
  },
}

