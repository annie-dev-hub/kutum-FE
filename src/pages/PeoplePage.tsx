import { useEffect, useState } from 'react'
import TopNav from '@/components/layout/TopNav'
import { Plus, Edit, X } from 'lucide-react'

type Member = {
  id: string
  name: string
  relation: 'Self' | 'Spouse' | 'Son' | 'Daughter' | 'Father' | 'Mother' | 'Brother' | 'Sister'
  age: string
  avatar: string
  dateOfBirth?: string
  gender?: string
  bloodGroup?: string
  height?: string
  weight?: string
}

const membersSeed: Member[] = [
  { id: '1', name: 'Rajesh Kumar', relation: 'Self', age: '40 years', avatar: '🧑🏻', dateOfBirth: '15/3/1985', gender: 'Male', bloodGroup: 'O+', height: '175 cm', weight: '70 kg' },
  { id: '2', name: 'Priya Kumar', relation: 'Spouse', age: '37 years', avatar: '👩🏻', dateOfBirth: '22/7/1988', gender: 'Female', bloodGroup: 'A+', height: '162 cm', weight: '58 kg' },
  { id: '3', name: 'Arjun Kumar', relation: 'Son', age: '10 years', avatar: '👦🏻', dateOfBirth: '10/5/2015', gender: 'Male', bloodGroup: 'O+', height: '140 cm', weight: '35 kg' },
  { id: '4', name: 'Ananya Kumar', relation: 'Daughter', age: '7 years', avatar: '👧🏻', dateOfBirth: '18/9/2018', gender: 'Female', bloodGroup: 'A+', height: '120 cm', weight: '25 kg' },
]

const avatarOptions = ['🧑🏻', '👩🏻', '👦🏻', '👧🏻', '👴🏻', '👵🏻', '🧒🏻', '👨🏻', '🧑‍🦱', '👩‍🦱']

export default function PeoplePage() {
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const raw = localStorage.getItem('kutum_people')
      return raw ? JSON.parse(raw) : membersSeed
    } catch {
      return membersSeed
    }
  })
  const [selectedId, setSelectedId] = useState<string>(() => (members[0]?.id ?? '1'))
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '',
    relation: 'Son',
    age: '',
    avatar: '🧑🏻',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    height: '',
    weight: ''
  })
  const [editMember, setEditMember] = useState<Member | null>(null)
  
  const selected = members.find(m => m.id === selectedId)!

  // Persist current members to localStorage so dashboard count matches
  useEffect(() => {
    try {
      localStorage.setItem('kutum_people', JSON.stringify(members))
      // notify dashboards to recompute counts
      window.dispatchEvent(new CustomEvent('dataChanged'))
    } catch {}
  }, [members])

  const handleAddMember = () => {
    if (!newMember.name || !newMember.age) {
      alert('Please fill in name and age')
      return
    }
    
    const memberToAdd: Member = {
      id: Date.now().toString(),
      name: newMember.name,
      relation: newMember.relation as Member['relation'],
      age: newMember.age,
      avatar: newMember.avatar || '🧑🏻',
      dateOfBirth: newMember.dateOfBirth,
      gender: newMember.gender,
      bloodGroup: newMember.bloodGroup,
      height: newMember.height,
      weight: newMember.weight
    }
    
    setMembers([...members, memberToAdd])
    setSelectedId(memberToAdd.id)
    setShowAddModal(false)
    setNewMember({
      name: '',
      relation: 'Son',
      age: '',
      avatar: '🧑🏻',
      dateOfBirth: '',
      gender: 'Male',
      bloodGroup: 'O+',
      height: '',
      weight: ''
    })
  }

  const handleEditClick = () => {
    setEditMember(selected)
    setShowEditModal(true)
  }

  const handleUpdateMember = () => {
    if (!editMember || !editMember.name || !editMember.age) {
      alert('Please fill in name and age')
      return
    }
    
    setMembers(members.map(m => m.id === editMember.id ? editMember : m))
    setShowEditModal(false)
    setEditMember(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav role="user" />
      <main className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Family Members</h1>
            <p className="text-gray-600">Manage your family profiles and personal information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left list */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Family Members</h3>
                </div>
                <div className="space-y-2">
                  {members.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedId(m.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg border transition
                        ${selectedId === m.id ? 'bg-green-50 border-green-200' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 grid place-items-center text-lg">
                        {m.avatar}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{m.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${m.relation === 'Self' ? 'bg-blue-100 text-blue-700' : m.relation === 'Spouse' ? 'bg-pink-100 text-pink-700' : 'bg-green-100 text-green-700'}`}>{m.relation}</span>
                          <span>{m.age}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right details */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 grid place-items-center text-xl">{selected.avatar}</div>
                    <div>
                      <div className="text-xl font-semibold text-gray-900">{selected.name}</div>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{selected.relation}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleEditClick}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between"><span className="text-gray-500">Date of Birth:</span><span>{selected.dateOfBirth || 'N/A'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Age:</span><span>{selected.age}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Gender:</span><span>{selected.gender || 'N/A'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Blood Group:</span><span>{selected.bloodGroup || 'N/A'}</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Physical Details</h4>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between"><span className="text-gray-500">Height:</span><span>{selected.height || 'N/A'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Weight:</span><span>{selected.weight || 'N/A'}</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-gray-200 p-4 text-center">
                    <div className="text-gray-500">Shirt</div>
                    <div className="text-xl font-semibold">L</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4 text-center">
                    <div className="text-gray-500">Pants</div>
                    <div className="text-xl font-semibold">32</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4 text-center">
                    <div className="text-gray-500">Shoes</div>
                    <div className="text-xl font-semibold">9</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Vegetarian', 'Cricket', 'Reading'].map(p => (
                      <span key={p} className="px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-200">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </main>
      
      {/* Add Member Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-700 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-emerald-800 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Family Member</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Avatar Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map(avatar => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setNewMember({...newMember, avatar})}
                      className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center border-2 transition-colors ${
                        newMember.avatar === avatar ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Relation and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relation *</label>
                  <select
                    value={newMember.relation}
                    onChange={(e) => setNewMember({...newMember, relation: e.target.value as Member['relation']})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Self">Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={newMember.gender}
                    onChange={(e) => setNewMember({...newMember, gender: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth and Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="text"
                    value={newMember.dateOfBirth}
                    onChange={(e) => setNewMember({...newMember, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                  <input
                    type="text"
                    value={newMember.age}
                    onChange={(e) => setNewMember({...newMember, age: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 25 years"
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                <select
                  value={newMember.bloodGroup}
                  onChange={(e) => setNewMember({...newMember, bloodGroup: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* Height and Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                  <input
                    type="text"
                    value={newMember.height}
                    onChange={(e) => setNewMember({...newMember, height: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 175 cm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                  <input
                    type="text"
                    value={newMember.weight}
                    onChange={(e) => setNewMember({...newMember, weight: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 70 kg"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && editMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Edit Family Member</h2>
              <button 
                onClick={() => {
                  setShowEditModal(false)
                  setEditMember(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Avatar Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map(avatar => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setEditMember({...editMember, avatar})}
                      className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center border-2 transition-colors ${
                        editMember.avatar === avatar ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={editMember.name}
                  onChange={(e) => setEditMember({...editMember, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Relation and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relation *</label>
                  <select
                    value={editMember.relation}
                    onChange={(e) => setEditMember({...editMember, relation: e.target.value as Member['relation']})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Self">Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={editMember.gender}
                    onChange={(e) => setEditMember({...editMember, gender: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth and Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="text"
                    value={editMember.dateOfBirth || ''}
                    onChange={(e) => setEditMember({...editMember, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                  <input
                    type="text"
                    value={editMember.age}
                    onChange={(e) => setEditMember({...editMember, age: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 25 years"
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                <select
                  value={editMember.bloodGroup}
                  onChange={(e) => setEditMember({...editMember, bloodGroup: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* Height and Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                  <input
                    type="text"
                    value={editMember.height || ''}
                    onChange={(e) => setEditMember({...editMember, height: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 175 cm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                  <input
                    type="text"
                    value={editMember.weight || ''}
                    onChange={(e) => setEditMember({...editMember, weight: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 70 kg"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditMember(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMember}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Update Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


