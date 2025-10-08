import { useAuth } from '@/contexts/AuthContext'
import { Users, FileText, Car, Bell, Plus, Upload, Heart, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '@/components/layout/TopNav'

type FamilyMember = {
  id: string
  name: string
  relation: string
  age: string
  avatar: string
}

export default function UserDashboardPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [peopleCount, setPeopleCount] = useState(() => {
    try {
      const raw = localStorage.getItem('kutum_people')
      const arr = raw ? JSON.parse(raw) : []
      return Array.isArray(arr) && arr.length > 0 ? arr.length : 4
    } catch {
      return 4
    }
  })
  
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    try {
      const raw = localStorage.getItem('kutum_people')
      const arr = raw ? JSON.parse(raw) : []
      return Array.isArray(arr) && arr.length > 0 ? arr : [
        { id: '1', name: 'John Doe', relation: 'Self', age: '35 years', avatar: '👨' },
        { id: '2', name: 'Sarah Doe', relation: 'Spouse', age: '32 years', avatar: '👩' },
        { id: '3', name: 'Mike Doe', relation: 'Son', age: '8 years', avatar: '👦' },
        { id: '4', name: 'Emma Doe', relation: 'Daughter', age: '5 years', avatar: '👧' },
      ]
    } catch {
      return [
        { id: '1', name: 'John Doe', relation: 'Self', age: '35 years', avatar: '👨' },
        { id: '2', name: 'Sarah Doe', relation: 'Spouse', age: '32 years', avatar: '👩' },
        { id: '3', name: 'Mike Doe', relation: 'Son', age: '8 years', avatar: '👦' },
        { id: '4', name: 'Emma Doe', relation: 'Daughter', age: '5 years', avatar: '👧' },
      ]
    }
  })

  useEffect(() => {
    const updateData = () => {
      try {
        const raw = localStorage.getItem('kutum_people')
        const arr = raw ? JSON.parse(raw) : []
        if (Array.isArray(arr) && arr.length > 0) {
          setPeopleCount(arr.length)
          setFamilyMembers(arr)
        } else {
          setPeopleCount(4)
        }
      } catch {
        setPeopleCount(4)
      }
    }

    // Listen for data changes
    window.addEventListener('dataChanged', updateData)
    return () => window.removeEventListener('dataChanged', updateData)
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Authenticated</h2>
          <p className="text-gray-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  const dashboardStats = [
    { label: 'Family Members', value: String(peopleCount), icon: Users, color: 'bg-blue-500' },
    { label: 'Documents', value: '24', icon: FileText, color: 'bg-green-500' },
    { label: 'Vehicles', value: '2', icon: Car, color: 'bg-purple-500' },
    { label: 'Reminders', value: '4', icon: Bell, color: 'bg-red-500' },
  ]

  const reminders = [
    { 
      title: 'Passport expires in 30 days', 
      person: 'John Doe • 2024-02-15', 
      priority: 'high', 
      icon: FileText 
    },
    { 
      title: 'Car insurance renewal', 
      person: 'Family Car • 2024-02-20', 
      priority: 'medium', 
      icon: Car 
    },
    { 
      title: 'Annual checkup due', 
      person: 'Sarah Doe • 2024-02-25', 
      priority: 'low', 
      icon: Heart 
    },
    { 
      title: 'Birthday coming up', 
      person: 'Mike Doe • 2024-02-18', 
      priority: 'medium', 
      icon: Bell 
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav role="user" />

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Family Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what needs your attention.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {dashboardStats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Reminders</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                Add Reminder
              </button>
            </div>
            <div className="space-y-4">
              {reminders.map((reminder, idx) => {
                const Icon = reminder.icon
                return (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{reminder.title}</div>
                      <div className="text-sm text-gray-600">{reminder.person}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                      {reminder.priority}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
        
        {/* Right column */}
          <div className="lg:col-start-9 lg:col-span-4 space-y-6">
            {/* Family Members card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Members</h3>
              <div className="space-y-3 mb-4">
              {familyMembers.map((member, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.relation} • {member.age}</div>
                  </div>
                </div>
              ))}
              </div>
              <button 
                onClick={() => navigate('/people')}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Family Member
              </button>
            </div>
            {/* Quick Actions card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Upload className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Upload Document</span>
                </button>
                <button className="w-full flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Car className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Add Vehicle</span>
                </button>
                <button className="w-full flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Log Health Info</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Talk with Us
        </button>
      </div>
    </div>
  )
}