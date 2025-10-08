import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// Removed Next.js router - handled in components
import toast from 'react-hot-toast'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('kutum_user')
    console.log('AuthContext useEffect - savedUser:', savedUser)
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      console.log('AuthContext - parsed user:', parsedUser)
      setUser(parsedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check for admin credentials first
      if (email === 'admin@kutum.com' && password === 'admin123') {
        console.log('Admin login attempt successful')
        const adminUser: User = {
          id: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@kutum.com',
          phoneNumber: '',
          role: 'admin'
        }
        console.log('Setting admin user:', adminUser)
        setUser(adminUser)
        localStorage.setItem('kutum_user', JSON.stringify(adminUser))
        toast.success('Admin login successful!')
        return true
      }
      
      // Check against regular users
      const users = JSON.parse(localStorage.getItem('kutum_users') || '[]')
      const foundUser = users.find((u: User & { password: string }) => 
        u.email === email && u.password === password
      )
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem('kutum_user', JSON.stringify(userWithoutPassword))
        toast.success('Login successful!')
        return true
      } else {
        toast.error('Invalid credentials')
        return false
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true)
      console.log('Starting registration for:', userData.email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('kutum_users') || '[]')
      console.log('Existing users:', users.length)
      
      const existingUser = users.find((u: User) => 
        u.email === userData.email
      )
      
      if (existingUser) {
        console.log('User already exists:', existingUser.email)
        toast.error('User with this email already exists')
        return false
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        password: userData.password, // In real app, this would be hashed
        role: 'user' as const
      }
      
      users.push(newUser)
      localStorage.setItem('kutum_users', JSON.stringify(users))
      console.log('User registered successfully:', newUser.email)
      
      toast.success('Registration successful! Please login.')
      return true
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('kutum_user')
    toast.success('Logged out successfully')
    // Force page reload to clear any cached state
    window.location.href = '/'
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
