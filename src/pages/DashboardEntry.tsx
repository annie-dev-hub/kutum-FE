import TopNav from '@/components/layout/TopNav'
import { useAuth } from '@/contexts/AuthContext'
import AdminDashboardPage from './AdminDashboardPage'
import UserDashboardPage from './UserDashboardPage'

export default function DashboardEntry() {
  const { isAdmin } = useAuth()

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNav role="admin" />
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <AdminDashboardPage />
        </main>
      </div>
    )
  }

  return <UserDashboardPage />
}


