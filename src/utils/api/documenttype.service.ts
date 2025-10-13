/**
 * Document Types API Service
 * Handles document type CRUD operations
 */

import type {
    CreateDocumentTypeDto,
    DocumentType,
    PaginatedResponse,
    PaginationParams,
    StandardResponse,
    UpdateDocumentTypeDto,
} from '@/types/api'
import apiClient from './axios'

export const documentTypeService = {
  /**
   * Get all document types with pagination
   */
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<DocumentType>> {
    const response = await apiClient.get<StandardResponse<PaginatedResponse<DocumentType>>>(
      '/document-types',
      { params }
    )
    return response.data.data
  },

  /**
   * Get single document type by ID
   */
  async getById(id: string): Promise<DocumentType> {
    const response = await apiClient.get<StandardResponse<DocumentType>>(
      `/document-types/${id}`
    )
    return response.data.data
  },

  /**
   * Create new document type
   */
  async create(data: CreateDocumentTypeDto): Promise<DocumentType> {
    const response = await apiClient.post<StandardResponse<DocumentType>>(
      '/document-types',
      data
    )
    return response.data.data
  },

  /**
   * Update existing document type
   */
  async update(id: string, data: UpdateDocumentTypeDto): Promise<DocumentType> {
    const response = await apiClient.patch<StandardResponse<DocumentType>>(
      `/document-types/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete document type (soft delete)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/document-types/${id}`)
  },
}

