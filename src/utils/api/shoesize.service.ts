/**
 * Shoe Size Types API Service
 * Handles shoe size CRUD operations
 */

import type {
    CreateShoeSizeDto,
    PaginatedResponse,
    PaginationParams,
    ShoeSizeType,
    StandardResponse,
    UpdateShoeSizeDto,
} from '@/types/api'
import apiClient from './axios'

export const shoeSizeService = {
  /**
   * Get all shoe sizes with pagination
   */
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<ShoeSizeType>> {
    const response = await apiClient.get<StandardResponse<PaginatedResponse<ShoeSizeType>>>(
      '/shoesize-types',
      { params }
    )
    return response.data.data
  },

  /**
   * Get single shoe size by ID
   */
  async getById(id: string): Promise<ShoeSizeType> {
    const response = await apiClient.get<StandardResponse<ShoeSizeType>>(
      `/shoesize-types/${id}`
    )
    return response.data.data
  },

  /**
   * Create new shoe size
   */
  async create(data: CreateShoeSizeDto): Promise<ShoeSizeType> {
    const response = await apiClient.post<StandardResponse<ShoeSizeType>>(
      '/shoesize-types',
      data
    )
    return response.data.data
  },

  /**
   * Update existing shoe size
   */
  async update(id: string, data: UpdateShoeSizeDto): Promise<ShoeSizeType> {
    const response = await apiClient.patch<StandardResponse<ShoeSizeType>>(
      `/shoesize-types/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete shoe size (soft delete)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/shoesize-types/${id}`)
  },
}

