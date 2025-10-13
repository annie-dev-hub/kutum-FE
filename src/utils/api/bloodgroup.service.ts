/**
 * Blood Group Types API Service
 * Handles blood group CRUD operations
 */

import type {
  BloodGroupType,
  CreateBloodGroupDto,
  PaginatedResponse,
  PaginationParams,
  StandardResponse,
  UpdateBloodGroupDto,
} from '@/types/api'
import apiClient from './axios'

export const bloodGroupService = {
  /**
   * Get all blood groups with pagination
   */
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<BloodGroupType>> {
    const response = await apiClient.get<StandardResponse<PaginatedResponse<BloodGroupType>>>(
      '/bloodgroup-types',
      { params }
    )
    return response.data.data
  },

  /**
   * Get single blood group by ID
   */
  async getById(id: string): Promise<BloodGroupType> {
    const response = await apiClient.get<StandardResponse<BloodGroupType>>(
      `/bloodgroup-types/${id}`
    )
    return response.data.data
  },

  /**
   * Create new blood group
   */
  async create(data: CreateBloodGroupDto): Promise<BloodGroupType> {
    const response = await apiClient.post<StandardResponse<BloodGroupType>>(
      '/bloodgroup-types',
      data
    )
    return response.data.data
  },

  /**
   * Update existing blood group
   */
  async update(id: string, data: UpdateBloodGroupDto): Promise<BloodGroupType> {
    const response = await apiClient.patch<StandardResponse<BloodGroupType>>(
      `/bloodgroup-types/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete blood group (soft delete)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/bloodgroup-types/${id}`)
  },
}

