/**
 * ========================================
 * AUTHENTICATION CONTEXT
 * ========================================
 * 
 * Manages user authentication state globally across the application
 * 
 * Features:
 * - User login/registration
 * - Session persistence via localStorage
 * - Role-based access (admin/user)
 * - Protected route support
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import toast from 'react-hot-toast' // For user notifications

/**
 * User interface - Defines the structure of user data
 */
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: 'admin' | 'user' // Determines access level
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
 */
export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
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
   * Restores user session from localStorage if available
   */
  useEffect(() => {
    // Try to restore user session from localStorage
    const savedUser = localStorage.getItem('kutum_user')
    console.log('AuthContext useEffect - savedUser:', savedUser)
    
    if (savedUser) {
      // Parse and restore user data
      const parsedUser = JSON.parse(savedUser)
      console.log('AuthContext - parsed user:', parsedUser)
      setUser(parsedUser)
    }
    
    // Done checking auth status
    setLoading(false)
  }, [])

  /**
   * ========== LOGIN FUNCTION ==========
   * Authenticates user with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise<boolean> - True if login successful, false otherwise
   * 
   * Process:
   * 1. Validates credentials
   * 2. Checks admin credentials first
   * 3. Then checks regular user database
   * 4. Stores user session in localStorage
   * 5. Updates global auth state
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Simulate API call delay (in real app, this would be actual API request)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // ADMIN LOGIN: Check for admin credentials first
      if (email === 'admin@kutum.com' && password === 'admin123') {
        console.log('Admin login attempt successful')
        
        // Create admin user object
        const adminUser: User = {
          id: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@kutum.com',
          phoneNumber: '',
          role: 'admin' // Admin role gives access to configuration pages
        }
        
        console.log('Setting admin user:', adminUser)
        setUser(adminUser) // Update global state
        localStorage.setItem('kutum_user', JSON.stringify(adminUser)) // Persist session
        toast.success('Admin login successful!')
        return true
      }
      
      // REGULAR USER LOGIN: Check against registered users in localStorage
      const users = JSON.parse(localStorage.getItem('kutum_users') || '[]')
      const foundUser = users.find((u: User & { password: string }) => 
        u.email === email && u.password === password // Match email and password
      )
      
      if (foundUser) {
        // Remove password from user object before storing (security)
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword) // Update global state
        localStorage.setItem('kutum_user', JSON.stringify(userWithoutPassword)) // Persist session
        toast.success('Login successful!')
        return true
      } else {
        // Invalid credentials
        toast.error('Invalid credentials')
        return false
      }
    } catch (error) {
      // Handle any unexpected errors
      toast.error('Login failed. Please try again.')
      return false
    } finally {
      // Always stop loading state
      setLoading(false)
    }
  }

  /**
   * ========== REGISTRATION FUNCTION ==========
   * Creates new user account
   * 
   * @param userData - User registration information
   * @returns Promise<boolean> - True if registration successful, false otherwise
   * 
   * Process:
   * 1. Validates email is unique
   * 2. Creates new user with default 'user' role
   * 3. Stores in localStorage (in real app, would be database)
   * 4. Returns success/failure
   * 
   * Note: In production, password should be hashed before storage
   */
  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true)
      console.log('Starting registration for:', userData.email)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Load existing users from localStorage
      const users = JSON.parse(localStorage.getItem('kutum_users') || '[]')
      console.log('Existing users:', users.length)
      
      // Check if email is already registered
      const existingUser = users.find((u: User) => 
        u.email === userData.email
      )
      
      if (existingUser) {
        // Email already exists - reject registration
        console.log('User already exists:', existingUser.email)
        toast.error('User with this email already exists')
        return false
      }
      
      // Create new user object
      const newUser = {
        id: Date.now().toString(), // Generate unique ID
        ...userData, // Spread all user data
        password: userData.password, // ⚠️ In real app, this would be hashed!
        role: 'user' as const // All new users start as regular users (not admin)
      }
      
      // Add to users array and save
      users.push(newUser)
      localStorage.setItem('kutum_users', JSON.stringify(users))
      console.log('User registered successfully:', newUser.email)
      
      // Show success message
      toast.success('Registration successful! Please login.')
      return true
    } catch (error) {
      // Handle any errors during registration
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
      return false
    } finally {
      // Always stop loading state
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
