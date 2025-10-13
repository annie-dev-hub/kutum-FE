/**
 * Axios Configuration for API Requests
 * Handles authentication, error handling, and request/response interceptors
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'

// API base URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * Automatically adds JWT token to all requests if available
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get JWT token from localStorage
    const user = localStorage.getItem('kutum_user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        const token = userData.access_token
        
        if (token && config.headers) {
          // Add Bearer token to Authorization header
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles common error scenarios and token expiration
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response
  },
  (error: AxiosError<any>) => {
    // Handle specific error status codes
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.message

      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          toast.error('Session expired. Please login again.')
          // Clear user data and redirect to login
          localStorage.removeItem('kutum_user')
          window.location.href = '/'
          break
        
        case 403:
          // Forbidden - User doesn't have permission
          toast.error('You do not have permission to perform this action.')
          break
        
        case 404:
          // Not found
          toast.error('Resource not found.')
          break
        
        case 409:
          // Conflict (e.g., duplicate email/mobile)
          toast.error(message || 'A conflict occurred.')
          break
        
        case 422:
          // Validation error
          toast.error(message || 'Validation failed.')
          break
        
        case 500:
          // Server error
          toast.error('Server error. Please try again later.')
          break
        
        default:
          // Generic error
          toast.error(message || 'An error occurred.')
      }
    } else if (error.request) {
      // Network error - no response received
      toast.error('Network error. Please check your connection.')
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient

