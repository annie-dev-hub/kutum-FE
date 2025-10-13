/**
 * Clothing Size Types API Service
 * Handles clothing size CRUD operations
 */

import type {
    ClothingSizeType,
    CreateClothingSizeDto,
    PaginatedResponse,
    PaginationParams,
    StandardResponse,
    UpdateClothingSizeDto,
} from '@/types/api'
import apiClient from './axios'

export const clothingSizeService = {
  /**
   * Get all clothing sizes with pagination
   */
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<ClothingSizeType>> {
    const response = await apiClient.get<StandardResponse<PaginatedResponse<ClothingSizeType>>>(
      '/clothingsize-types',
      { params }
    )
    return response.data.data
  },

  /**
   * Get single clothing size by ID
   */
  async getById(id: string): Promise<ClothingSizeType> {
    const response = await apiClient.get<StandardResponse<ClothingSizeType>>(
      `/clothingsize-types/${id}`
    )
    return response.data.data
  },

  /**
   * Create new clothing size
   */
  async create(data: CreateClothingSizeDto): Promise<ClothingSizeType> {
    const response = await apiClient.post<StandardResponse<ClothingSizeType>>(
      '/clothingsize-types',
      data
    )
    return response.data.data
  },

  /**
   * Update existing clothing size
   */
  async update(id: string, data: UpdateClothingSizeDto): Promise<ClothingSizeType> {
    const response = await apiClient.patch<StandardResponse<ClothingSizeType>>(
      `/clothingsize-types/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete clothing size (soft delete)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/clothingsize-types/${id}`)
  },
}

