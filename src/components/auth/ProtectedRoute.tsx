import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  console.log('ProtectedRoute - user:', user, 'loading:', loading)

  if (loading) {
    console.log('ProtectedRoute - showing loading spinner')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-kutum-600"></div>
      </div>
    )
  }

  if (!user) {
    console.log('ProtectedRoute - no user, redirecting to login')
    return <Navigate to="/" replace />
  }

  console.log('ProtectedRoute - rendering children')
  return <>{children}</>
}

