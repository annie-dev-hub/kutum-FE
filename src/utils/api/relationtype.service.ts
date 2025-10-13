/**
 * Relation Types API Service
 * Handles relation type CRUD operations
 */

import type {
    CreateRelationTypeDto,
    PaginatedResponse,
    PaginationParams,
    RelationType,
    StandardResponse,
    UpdateRelationTypeDto,
} from '@/types/api'
import apiClient from './axios'

export const relationTypeService = {
  /**
   * Get all relation types with pagination
   */
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<RelationType>> {
    const response = await apiClient.get<StandardResponse<PaginatedResponse<RelationType>>>(
      '/relation-types',
      { params }
    )
    return response.data.data
  },

  /**
   * Get single relation type by ID
   */
  async getById(id: string): Promise<RelationType> {
    const response = await apiClient.get<StandardResponse<RelationType>>(
      `/relation-types/${id}`
    )
    return response.data.data
  },

  /**
   * Create new relation type
   */
  async create(data: CreateRelationTypeDto): Promise<RelationType> {
    const response = await apiClient.post<StandardResponse<RelationType>>(
      '/relation-types',
      data
    )
    return response.data.data
  },

  /**
   * Update existing relation type
   */
  async update(id: string, data: UpdateRelationTypeDto): Promise<RelationType> {
    const response = await apiClient.patch<StandardResponse<RelationType>>(
      `/relation-types/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete relation type (soft delete)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/relation-types/${id}`)
  },
}

