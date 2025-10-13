/**
 * ========================================
 * AUTHENTICATION CONTEXT
 * ========================================
 * 
 * Manages user authentication state globally across the application
 * 
 * Features:
 * - User login/registration via backend API
 * - JWT token management
 * - Session persistence via localStorage
 * - Role-based access (admin/normal)
 * - Protected route support
 */

import { authService } from '@/utils/api';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast'; // For user notifications

/**
 * User interface - Defines the structure of user data
 * Now includes access_token for JWT authentication
 */
export interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  phoneNumber: string
  role: 'admin' | 'normal' // Backend uses 'normal' instead of 'user'
  access_token: string // JWT token for authenticated requests
}

/**
 * AuthContext interface - Defines all authentication functions and state
 */
interface AuthContextType {
  user: User | null // Currently logged-in user (null if not logged in)
  loading: boolean // True while checking authentication status
  login: (email: string, password: string) => Promise<boolean> // Login function
  register: (userData: RegisterData) => Promise<boolean> // Registration function
  logout: () => void // Logout function
  isAdmin: boolean // Quick check if current user is admin
}

/**
 * Registration data interface - Data needed to create new user account
 * Updated to match backend API requirements
 */
export interface RegisterData {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber: string // Required by backend (mobile field)
  password: string
}

// Create React context for authentication state
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider Component
 * Wraps the entire application to provide authentication context
 * 
 * @param children - Child components that will have access to auth context
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // ========== STATE ==========
  const [user, setUser] = useState<User | null>(null) // Currently logged-in user
  const [loading, setLoading] = useState(true) // Loading state during auth check

  /**
   * On app startup, check if user is already logged in
   * Restores user session from localStorage and validates with backend
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to restore user session from localStorage
        const savedUser = localStorage.getItem('kutum_user')
        console.log('AuthContext useEffect - savedUser:', savedUser)
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          console.log('AuthContext - parsed user:', parsedUser)
          
          // Validate token with backend (optional - validates session)
          try {
            await authService.me()
            setUser(parsedUser)
          } catch (error) {
            // Token is invalid or expired, clear local storage
            console.error('Session validation failed:', error)
            localStorage.removeItem('kutum_user')
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()
  }, [])

  /**
   * ========== LOGIN FUNCTION ==========
   * Authenticates user with email or mobile number via backend API
   * 
   * @param emailOrMobile - User's email address or mobile number
   * @param password - User's password
   * @returns Promise<boolean> - True if login successful, false otherwise
   * 
   * Process:
   * 1. Calls backend API with credentials
   * 2. Receives JWT token and user data
   * 3. Stores token and user data in localStorage
   * 4. Updates global auth state
   */
  const login = async (emailOrMobile: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      console.log('Attempting login for:', emailOrMobile)
      
      // Determine if input is email or mobile
      const isEmail = emailOrMobile.includes('@')
      
      // Call backend API
      const response: AuthResponse = await authService.login({
        email: isEmail ? emailOrMobile : undefined,
        mobile: !isEmail ? emailOrMobile : undefined,
        password,
      })
      
      console.log('Login response:', response)
      
      // Transform backend response to our User interface
      const user: User = {
        id: response.user_id,
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email,
        phoneNumber: response.mobile,
        role: response.role,
        access_token: response.access_token,
      }
      
      // Update state and persist to localStorage
      setUser(user)
      localStorage.setItem('kutum_user', JSON.stringify(user))
      
      toast.success(`Welcome back, ${user.firstName || 'User'}!`)
      console.log('Login successful:', user)
      return true
    } catch (error: any) {
      console.error('Login error:', error)
      // Error toast is handled by axios interceptor
      return false
    } finally {
      setLoading(false)
    }
  }

  /**
   * ========== REGISTRATION FUNCTION ==========
   * Creates new user account via backend API
   * 
   * @param userData - User registration information
   * @returns Promise<boolean> - True if registration successful, false otherwise
   * 
   * Process:
   * 1. Calls backend API with user data
   * 2. Backend validates and creates account
   * 3. Receives JWT token and auto-logs in the user
   * 4. Updates global auth state
   */
  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true)
      console.log('Starting registration for:', userData.email || userData.phoneNumber)
      
      // Call backend API
      const response: AuthResponse = await authService.register({
        email: userData.email,
        mobile: userData.phoneNumber,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      })
      
      console.log('Registration response:', response)
      
      // Transform backend response to our User interface
      const user: User = {
        id: response.user_id,
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email,
        phoneNumber: response.mobile,
        role: response.role,
        access_token: response.access_token,
      }
      
      // Update state and persist to localStorage (auto-login after registration)
      setUser(user)
      localStorage.setItem('kutum_user', JSON.stringify(user))
      
      toast.success('Registration successful! Welcome to Kutum!')
      console.log('Registration successful:', user)
      return true
    } catch (error: any) {
      console.error('Registration error:', error)
      // Error toast is handled by axios interceptor
      return false
    } finally {
      setLoading(false)
    }
  }

  /**
   * ========== LOGOUT FUNCTION ==========
   * Logs out current user and clears session
   * 
   * Process:
   * 1. Clears user state
   * 2. Removes session from localStorage
   * 3. Redirects to login page
   * 4. Forces page reload to clear all cached data
   */
  const logout = () => {
    setUser(null) // Clear user from state
    localStorage.removeItem('kutum_user') // Remove session data
    toast.success('Logged out successfully')
    
    // Force full page reload to clear any cached state
    window.location.href = '/'
  }

  // Quick helper to check if current user is admin
  const isAdmin = user?.role === 'admin'

  // Provide auth context to all child components
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * ========== AUTH HOOK ==========
 * Custom hook to access authentication context
 * 
 * Usage:
 *   const { user, login, logout, isAdmin } = useAuth()
 * 
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  // Ensure hook is used within AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
