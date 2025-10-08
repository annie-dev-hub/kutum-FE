import { Heart, FileText, Users, Shirt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import UserDashboardPage from './UserDashboardPage'

export default function AdminDashboardPage() {
  const { isAdmin, loading, user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState([
    { label: 'Blood Groups', value: 6, icon: Heart, color: 'bg-red-400', href: '/blood-groups' },
    { label: 'Document Types', value: 8, icon: FileText, color: 'bg-blue-400', href: '/document-types' },
    { label: 'Relation Types', value: 6, icon: Users, color: 'bg-green-400', href: '/relation-types' },
    { label: 'Clothing Sizes', value: 6, icon: Shirt, color: 'bg-purple-400', href: '/clothing-sizes' },
  ])

  console.log('AdminDashboardPage rendering:', { isAdmin, loading, user })

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If user is not admin, show user dashboard
  if (!isAdmin) {
    return <UserDashboardPage />
  }

  // Update stats from localStorage
  useEffect(() => {
    const updateStats = () => {
      setStats(prev => prev.map(stat => {
        let count = 0
        switch (stat.label) {
          case 'Blood Groups':
            const bloodGroups = localStorage.getItem('kutum_blood_groups')
            count = bloodGroups ? JSON.parse(bloodGroups).length : 6
            break
          case 'Document Types':
            const docTypes = localStorage.getItem('kutum_document_types')
            count = docTypes ? JSON.parse(docTypes).length : 8
            break
          case 'Relation Types':
            const relationTypes = localStorage.getItem('kutum_relation_types')
            count = relationTypes ? JSON.parse(relationTypes).length : 6
            break
          case 'Clothing Sizes':
            const clothingSizes = localStorage.getItem('kutum_clothing_sizes')
            count = clothingSizes ? JSON.parse(clothingSizes).length : 6
            break
        }
        return { ...stat, value: count }
      }))
    }

    updateStats()
    
    // Listen for data changes
    window.addEventListener('dataChanged', updateStats)
    return () => window.removeEventListener('dataChanged', updateStats)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">System Dashboard</h1>
        <p className="text-slate-500">Central configuration for Kutum family management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <button
              key={idx}
              onClick={() => navigate(stat.href)}
              className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                <Icon className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}


