/**
 * User Family Members Page
 * Shows family members and personal details for a specific user
 */

import { useAuth } from '@/contexts/AuthContext'
import type { UserFamilyMember } from '@/types/api'
import { adminService } from '@/utils/api'
import { ArrowLeft, Calendar, Heart, User, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

export default function UserFamilyPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { id: userId } = useParams<{ id: string }>()
  
  // Redirect non-admin users to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  // Get user name from navigation state
  const userName = location.state?.userName || 'User'

  // State
  const [familyMembers, setFamilyMembers] = useState<UserFamilyMember[]>([])
  const [loading, setLoading] = useState(true)

  /**
   * Fetch user's family members
   */
  const fetchFamilyMembers = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const response: UserFamilyMember[] = await adminService.getUserFamilyMembers(userId)
      setFamilyMembers(response)
    } catch (error) {
      console.error('Error fetching family members:', error)
      toast.error('Failed to load family members')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFamilyMembers()
  }, [userId])

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  /**
   * Get user initials for avatar
   */
  const getUserInitials = (firstName?: string | null, lastName?: string | null): string => {
    const first = firstName?.charAt(0)?.toUpperCase() || ''
    const last = lastName?.charAt(0)?.toUpperCase() || ''
    return first + last || 'U'
  }

  /**
   * Get blood group badge color
   */
  const getBloodGroupColor = (bloodGroup?: string): string => {
    if (!bloodGroup) return 'bg-gray-100 text-gray-700'
    
    const colors: Record<string, string> = {
      'A+': 'bg-red-100 text-red-700',
      'A-': 'bg-red-100 text-red-700',
      'B+': 'bg-blue-100 text-blue-700',
      'B-': 'bg-blue-100 text-blue-700',
      'AB+': 'bg-purple-100 text-purple-700',
      'AB-': 'bg-purple-100 text-purple-700',
      'O+': 'bg-green-100 text-green-700',
      'O-': 'bg-green-100 text-green-700',
    }
    return colors[bloodGroup] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {userName}'s Family
            </h1>
            <p className="text-slate-600 mt-2">Family members and personal details</p>
          </div>
        </div>
        <div className="card p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-slate-600">Loading family members...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {userName}'s Family
          </h1>
          <p className="text-slate-600 mt-2">Family members and personal details</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Family Members</p>
              <p className="text-2xl font-bold text-slate-900">{familyMembers.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Family Heads</p>
              <p className="text-2xl font-bold text-slate-900">
                {familyMembers.filter(member => member.is_family_head).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Unique Blood Groups</p>
              <p className="text-2xl font-bold text-slate-900">
                {new Set(familyMembers.map(m => m.personal_details?.blood_group_name).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Family Members */}
      {familyMembers.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 grid place-items-center mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No family members found</h3>
          <p className="text-slate-600">This user hasn't added any family members yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map((member) => (
            <div key={member.id} className="card p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                    {getUserInitials(member.first_name, member.last_name)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-slate-900">
                      {member.first_name && member.last_name 
                        ? `${member.first_name} ${member.last_name}`
                        : member.first_name || member.last_name || 'No Name'
                      }
                    </h3>
                    <p className="text-sm text-slate-500">
                      {member.relation_type_name || 'Unknown Relation'}
                    </p>
                  </div>
                </div>
                {member.is_family_head && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    Head
                  </span>
                )}
              </div>

              {/* Personal Details */}
              {member.personal_details && (
                <div className="space-y-3">
                  {member.personal_details?.blood_group_name && (
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Blood Group:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBloodGroupColor(member.personal_details.blood_group_name)}`}>
                        {member.personal_details.blood_group_name}
                      </span>
                    </div>
                  )}
                  
                  {member.personal_details?.dob && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        Born: {formatDate(member.personal_details.dob)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Clothing Sizes */}
              {(member.personal_details?.upper_clothing_size_name || member.personal_details?.lower_clothing_size_name || member.personal_details?.shoes_size_name) && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.personal_details?.upper_clothing_size_name && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        Upper: {member.personal_details.upper_clothing_size_name}
                      </span>
                    )}
                    {member.personal_details?.lower_clothing_size_name && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        Lower: {member.personal_details.lower_clothing_size_name}
                      </span>
                    )}
                    {member.personal_details?.shoes_size_name && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        Shoes: {member.personal_details.shoes_size_name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {member.personal_details?.gender && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-medium">Gender:</span>
                    <span>{member.personal_details.gender}</span>
                  </div>
                  {(member.personal_details?.height || member.personal_details?.weight) && (
                    <div className="flex items-center gap-4 mt-2">
                      {member.personal_details.height && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <span>Height: {member.personal_details.height}cm</span>
                        </div>
                      )}
                      {member.personal_details.weight && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <span>Weight: {member.personal_details.weight}kg</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
