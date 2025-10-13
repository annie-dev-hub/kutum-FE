/**
 * TypeScript Types for Backend API
 * Matches the NestJS backend DTOs and response structures
 */

// ==================== Common Types ====================

export interface StandardResponse<T = any> {
  status_code: number
  status: boolean
  message: string
  data: T
  path: string
}

export interface PaginationMeta {
  totalItems: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
  search?: string
}

// ==================== Auth Types ====================

export interface LoginRequest {
  email?: string
  mobile?: string
  password: string
}

export interface RegisterRequest {
  email?: string
  mobile: string
  password: string
  first_name?: string
  last_name?: string
}

export interface AuthResponse {
  access_token: string
  user_id: string
  email: string | null
  mobile: string
  role: 'admin' | 'normal'
  is_active: boolean
  first_name: string | null
  last_name: string | null
}

export interface UserProfile {
  user_id: string
  email: string | null
  mobile: string
  role: 'admin' | 'normal'
  is_active: boolean
  first_name: string | null
  last_name: string | null
}

// ==================== Blood Group Types ====================

export interface BloodGroupType {
  id: string
  name: string
  description: string | null
  is_active: boolean
  is_predefined: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateBloodGroupDto {
  name: string
  description?: string
  is_active?: boolean
}

export interface UpdateBloodGroupDto {
  name?: string
  description?: string
  is_active?: boolean
}

// ==================== Document Types ====================

export interface DocumentType {
  id: string
  name: string
  description: string | null
  is_active: boolean
  is_predefined: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateDocumentTypeDto {
  name: string
  description?: string
  is_active?: boolean
}

export interface UpdateDocumentTypeDto {
  name?: string
  description?: string
  is_active?: boolean
}

// ==================== Relation Types ====================

export interface RelationType {
  id: string
  name: string
  description: string | null
  is_active: boolean
  is_predefined: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateRelationTypeDto {
  name: string
  description?: string
  is_active?: boolean
}

export interface UpdateRelationTypeDto {
  name?: string
  description?: string
  is_active?: boolean
}

// ==================== Clothing Size Types ====================

export type ClothCategory = 
  | 'pant_men' 
  | 'shirt_men' 
  | 'pant_women' 
  | 'shirt_women' 
  | 'dress_women' 
  | 'pant_boy' 
  | 'shirt_boy' 
  | 'pant_girl' 
  | 'shirt_girl' 
  | 'frock_girl'

export interface ClothingSizeType {
  id: string
  name: string
  description: string | null
  cloth_category: ClothCategory
  is_active: boolean
  is_predefined: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateClothingSizeDto {
  name: string
  description?: string
  cloth_category: ClothCategory
  is_active?: boolean
}

export interface UpdateClothingSizeDto {
  name?: string
  description?: string
  cloth_category?: ClothCategory
  is_active?: boolean
}

// ==================== Shoe Size Types ====================

export interface ShoeSizeType {
  id: string
  name: string
  description: string | null
  is_active: boolean
  is_predefined: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateShoeSizeDto {
  name: string
  description?: string
  is_active?: boolean
}

export interface UpdateShoeSizeDto {
  name?: string
  description?: string
  is_active?: boolean
}

// ==================== Admin Types ====================

export interface AdminUser {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  mobile: string
  role: 'admin' | 'normal'
  is_active: boolean
  created_at: string
}

export interface UserFamilyMember {
  id: string
  first_name: string | null
  last_name: string | null
  relation_type_id: string
  relation_type_name: string
  is_family_head: boolean
  personal_details?: {
    dob?: string | null
    gender?: 'Male' | 'Female' | 'Other' | null
    height?: number | null
    weight?: number | null
    blood_group_id?: string | null
    blood_group_name?: string | null
    upper_clothing_size_id?: string | null
    upper_clothing_size_name?: string | null
    lower_clothing_size_id?: string | null
    lower_clothing_size_name?: string | null
    shoes_size_id?: string | null
    shoes_size_name?: string | null
  }
}

export interface FamilyMemberPersonalDetails {
  dob: string | null
  gender: 'Male' | 'Female' | 'Other' | null
  height: number | null
  weight: number | null
  blood_group_id: string | null
  blood_group_name: string | null
  upper_clothing_size_id: string | null
  upper_clothing_size_name: string | null
  lower_clothing_size_id: string | null
  lower_clothing_size_name: string | null
  shoes_size_id: string | null
  shoes_size_name: string | null
}

export interface FamilyMember {
  id: string
  relation_type_id: string
  relation_type_name: string
  first_name: string
  last_name: string
  is_family_head: boolean
  personal_details: FamilyMemberPersonalDetails | null
}

export interface AdminUsersQueryParams extends PaginationParams {
  search?: string
}

