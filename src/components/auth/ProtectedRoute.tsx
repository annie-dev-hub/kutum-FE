/**
 * ========================================
 * PROTECTED ROUTE COMPONENT
 * ========================================
 * 
 * Wrapper component that protects routes from unauthorized access
 * 
 * Features:
 * - Checks if user is authenticated
 * - Shows loading spinner while checking
 * - Redirects to login if not authenticated
 * - Renders protected content if authenticated
 * 
 * Usage:
 *   <ProtectedRoute>
 *     <DashboardPage />
 *   </ProtectedRoute>
 */

import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode // The protected content to render if authenticated
}

/**
 * ProtectedRoute Component
 * Guards routes that require authentication
 * 
 * @param children - React components to render if user is authenticated
 * @returns Loading spinner, redirect to login, or protected content
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Get current authentication state
  const { user, loading } = useAuth()

  console.log('ProtectedRoute - user:', user, 'loading:', loading)

  // CASE 1: Still checking authentication status
  if (loading) {
    console.log('ProtectedRoute - showing loading spinner')
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* Show loading spinner while checking auth */}
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-kutum-600"></div>
      </div>
    )
  }

  // CASE 2: No user logged in - redirect to login page
  if (!user) {
    console.log('ProtectedRoute - no user, redirecting to login')
    return <Navigate to="/" replace /> // Redirect to login page
  }

  // CASE 3: User is authenticated - render protected content
  console.log('ProtectedRoute - rendering children')
  return <>{children}</>
}

