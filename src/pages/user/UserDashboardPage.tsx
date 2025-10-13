import TopNav from '@/components/layout/TopNav'
import { useAuth } from '@/contexts/AuthContext'
import { Activity, Bell, Car, Clock, FileText, Heart, Plus, Users, X } from 'lucide-react'
// CHATBOT DISABLED - Removed unused imports: MessageCircle, Minimize2, Send
import { useEffect, useState } from 'react'
// CHATBOT DISABLED - Removed useRef (was used for chatEndRef)
import { useNavigate } from 'react-router-dom'

type FamilyMember = {
  id: string
  name: string
  relation: string
  age: string
  avatar: string
}

type Activity = {
  id: string
  type: 'family' | 'document' | 'vehicle' | 'health' | 'reminder'
  action: 'added' | 'updated' | 'deleted' | 'viewed'
  description: string
  timestamp: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

type Reminder = {
  id: string
  title: string
  person: string
  priority: 'high' | 'medium' | 'low'
  icon: React.ComponentType<{ className?: string }>
  source?: string
  originalId?: string
}

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
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

  const [recentActivities, setRecentActivities] = useState<Activity[]>(() => {
    try {
      const raw = localStorage.getItem('kutum_activities')
      const arr = raw ? JSON.parse(raw) : []
      return Array.isArray(arr) && arr.length > 0 ? arr : [
        {
          id: '1',
          type: 'document',
          action: 'added',
          description: 'Added passport for John Doe',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          icon: FileText,
          color: 'text-green-600'
        },
        {
          id: '2',
          type: 'vehicle',
          action: 'updated',
          description: 'Updated insurance for Honda City',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          icon: Car,
          color: 'text-purple-600'
        },
        {
          id: '3',
          type: 'family',
          action: 'added',
          description: 'Added new family member: Emma Doe',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          icon: Users,
          color: 'text-blue-600'
        },
        {
          id: '4',
          type: 'health',
          action: 'updated',
          description: 'Updated health record for Sarah Doe',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          icon: Heart,
          color: 'text-red-600'
        }
      ]
    } catch {
      return []
    }
  })

  const [reminders, setReminders] = useState<Reminder[]>([
    { 
      id: '1',
      title: 'Passport expires in 30 days', 
      person: 'John Doe • 2024-02-15', 
      priority: 'high', 
      icon: FileText 
    },
    { 
      id: '2',
      title: 'Car insurance renewal', 
      person: 'Family Car • 2024-02-20', 
      priority: 'medium', 
      icon: Car 
    },
    { 
      id: '3',
      title: 'Annual checkup due', 
      person: 'Sarah Doe • 2024-02-25', 
      priority: 'low', 
      icon: Heart 
    },
    { 
      id: '4',
      title: 'Birthday coming up', 
      person: 'Mike Doe • 2024-02-18', 
      priority: 'medium', 
      icon: Bell 
    },
    { 
      id: '5',
      title: 'Driver license renewal', 
      person: 'Rajesh Kumar • 2024-03-01', 
      priority: 'high', 
      icon: FileText 
    },
    { 
      id: '6',
      title: 'School fee payment', 
      person: 'Arjun Kumar • 2024-03-05', 
      priority: 'medium', 
      icon: Bell 
    },
    { 
      id: '7',
      title: 'Medical appointment', 
      person: 'Priya Kumar • 2024-03-10', 
      priority: 'low', 
      icon: Heart 
    },
    { 
      id: '8',
      title: 'Vehicle registration', 
      person: 'Honda City • 2024-03-15', 
      priority: 'high', 
      icon: Car 
    }
  ])

  const [showAddReminderModal, setShowAddReminderModal] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: '',
    person: '',
    priority: 'medium',
    dueDate: ''
  })
  const [showQuickAddModal, setShowQuickAddModal] = useState(false)

  // ========== CHAT STATE - DISABLED ==========
  // CHATBOT DISABLED - Uncomment below to re-enable chatbot functionality
  
  // const [showChat, setShowChat] = useState(false) // Controls whether chat panel is visible
  
  // // Stores all chat messages (conversation history)
  // const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
  //   {
  //     id: '1',
  //     role: 'assistant', // Bot's welcome message
  //     content: 'Hello! I can help you with ALL your family management data! Try asking:\n• "How many documents have been uploaded?"\n• "What vehicles do I have?"\n• "What reminders are due?"\n• "Tell me about my family"\n• "Give me a summary of everything"',
  //     timestamp: new Date().toISOString()
  //   }
  // ])
  
  // const [chatInput, setChatInput] = useState('') // Current text in the input field
  // const [isLoading, setIsLoading] = useState(false) // Shows loading indicator while waiting for AI response
  // const chatEndRef = useRef<HTMLDivElement>(null) // Reference for auto-scrolling to bottom

  // Function to add activity
  const addActivity = (type: Activity['type'], action: Activity['action'], description: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      action,
      description,
      timestamp: new Date().toISOString(),
      icon: type === 'family' ? Users : type === 'document' ? FileText : type === 'vehicle' ? Car : type === 'health' ? Heart : Bell,
      color: type === 'family' ? 'text-blue-600' : type === 'document' ? 'text-green-600' : type === 'vehicle' ? 'text-purple-600' : type === 'health' ? 'text-red-600' : 'text-orange-600'
    }
    
    setRecentActivities(prev => {
      const updated = [newActivity, ...prev].slice(0, 10) // Keep only last 10 activities
      localStorage.setItem('kutum_activities', JSON.stringify(updated))
      return updated
    })
  }

  // Function to format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  // Function to handle adding a new reminder
  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.person || !newReminder.dueDate) {
      alert('Please fill in all fields')
      return
    }

    const reminderIcons = [FileText, Car, Heart, Bell]
    const randomIcon = reminderIcons[Math.floor(Math.random() * reminderIcons.length)]

    const newReminderItem: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      person: `${newReminder.person} • ${newReminder.dueDate}`,
      priority: newReminder.priority as 'high' | 'medium' | 'low',
      icon: randomIcon
    }

    setReminders(prev => [newReminderItem, ...prev])
    
    // Add activity
    addActivity('reminder', 'added', `Added reminder: ${newReminder.title}`)
    
    // Reset form and close modal
    setNewReminder({ title: '', person: '', priority: 'medium', dueDate: '' })
    setShowAddReminderModal(false)
  }

  // Function to handle closing the modal
  const handleCloseReminderModal = () => {
    setShowAddReminderModal(false)
    setNewReminder({ title: '', person: '', priority: 'medium', dueDate: '' })
  }

  // Quick Add handlers
  const handleQuickAdd = (type: string) => {
    setShowQuickAddModal(false)
    switch (type) {
      case 'family':
        navigate('/people')
        // Trigger add modal after navigation
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('openAddMemberModal'))
        }, 100)
        break
      case 'document':
        navigate('/documents')
        // Trigger add modal after navigation
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('openAddDocumentModal'))
        }, 100)
        break
      case 'vehicle':
        navigate('/vehicles')
        break
      case 'health':
        navigate('/health')
        break
      case 'reminder':
        setShowAddReminderModal(true)
        break
    }
  }

  // Function to generate automatic reminders from all pages
  const generateAutoReminders = (): Reminder[] => {
    const autoReminders: Reminder[] = []

    try {
      // 1. Document expiry reminders
      const documents = JSON.parse(localStorage.getItem('kutum_documents') || '[]')
      documents.forEach((doc: any) => {
        if (doc.expires) {
          const expiryDate = new Date(doc.expires)
          const today = new Date()
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysUntilExpiry <= 90 && daysUntilExpiry > 0) {
            const priority = daysUntilExpiry <= 30 ? 'high' : daysUntilExpiry <= 60 ? 'medium' : 'low'
            autoReminders.push({
              id: `doc-${doc.id}`,
              title: `${doc.type} expires in ${daysUntilExpiry} days`,
              person: `${doc.personName} • ${doc.expires}`,
              priority,
              icon: FileText,
              source: 'document',
              originalId: doc.id
            })
          }
        }
      })

      // 2. Vehicle document expiry reminders
      const vehicles = JSON.parse(localStorage.getItem('kutum_vehicles') || '[]')
      vehicles.forEach((vehicle: any) => {
        vehicle.documents?.forEach((doc: any) => {
          if (doc.expires) {
            const expiryDate = new Date(doc.expires)
            const today = new Date()
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            
            if (daysUntilExpiry <= 90 && daysUntilExpiry > 0) {
              const priority = daysUntilExpiry <= 30 ? 'high' : daysUntilExpiry <= 60 ? 'medium' : 'low'
              autoReminders.push({
                id: `vehicle-${vehicle.id}-${doc.name}`,
                title: `${doc.name} expires in ${daysUntilExpiry} days`,
                person: `${vehicle.name} • ${doc.expires}`,
                priority,
                icon: Car,
                source: 'vehicle',
                originalId: vehicle.id
              })
            }
          }
        })
      })

      // 3. Health reminders (vaccinations, medication refills)
      const healthRecords = JSON.parse(localStorage.getItem('kutum_health_records') || '[]')
      healthRecords.forEach((record: any) => {
        if (record.type === 'Vaccination' && record.status === 'Resolved') {
          // Annual vaccination reminders
          const vaccinationDate = new Date(record.date)
          const nextDueDate = new Date(vaccinationDate)
          nextDueDate.setFullYear(nextDueDate.getFullYear() + 1)
          
          const today = new Date()
          const daysUntilDue = Math.ceil((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysUntilDue <= 30 && daysUntilDue > 0) {
            autoReminders.push({
              id: `health-vaccine-${record.id}`,
              title: `${record.title} due for renewal`,
              person: `${record.personName} • ${nextDueDate.toISOString().split('T')[0]}`,
              priority: 'medium',
              icon: Heart,
              source: 'health',
              originalId: record.id
            })
          }
        }
        
        if (record.type === 'Medication' && record.status === 'Active') {
          // Monthly medication refill reminder
          const medicationDate = new Date(record.date)
          const nextRefillDate = new Date(medicationDate)
          nextRefillDate.setMonth(nextRefillDate.getMonth() + 1)
          
          const today = new Date()
          const daysUntilRefill = Math.ceil((nextRefillDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysUntilRefill <= 7 && daysUntilRefill > 0) {
            autoReminders.push({
              id: `health-medication-${record.id}`,
              title: `${record.title} refill needed`,
              person: `${record.personName} • ${nextRefillDate.toISOString().split('T')[0]}`,
              priority: 'high',
              icon: Heart,
              source: 'health',
              originalId: record.id
            })
          }
        }
      })

      // 4. Birthday reminders (from family members)
      familyMembers.forEach((member) => {
        // Calculate next birthday (simplified - assumes current year)
        const today = new Date()
        const currentYear = today.getFullYear()
        const age = parseInt(member.age)
        const birthYear = currentYear - age
        const nextBirthday = new Date(birthYear, 0, 1) // Simplified to Jan 1st
        nextBirthday.setFullYear(currentYear)
        
        if (nextBirthday < today) {
          nextBirthday.setFullYear(currentYear + 1)
        }
        
        const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysUntilBirthday <= 30 && daysUntilBirthday > 0) {
          autoReminders.push({
            id: `birthday-${member.id}`,
            title: `Birthday coming up`,
            person: `${member.name} • ${nextBirthday.toISOString().split('T')[0]}`,
            priority: daysUntilBirthday <= 7 ? 'high' : 'medium',
            icon: Bell,
            source: 'family',
            originalId: member.id
          })
        }
      })

    } catch (error) {
      console.error('Error generating auto reminders:', error)
    }

    return autoReminders
  }

  // Update reminders when data changes
  useEffect(() => {
    const autoReminders = generateAutoReminders()
    const manualReminders: Reminder[] = [
      { 
        id: '1',
        title: 'Passport expires in 30 days', 
        person: 'John Doe • 2024-02-15', 
        priority: 'high', 
        icon: FileText 
      },
      { 
        id: '2',
        title: 'Car insurance renewal', 
        person: 'Family Car • 2024-02-20', 
        priority: 'medium', 
        icon: Car 
      },
      { 
        id: '3',
        title: 'Annual checkup due', 
        person: 'Sarah Doe • 2024-02-25', 
        priority: 'low', 
        icon: Heart 
      },
      { 
        id: '4',
        title: 'Birthday coming up', 
        person: 'Mike Doe • 2024-02-18', 
        priority: 'medium', 
        icon: Bell 
      }
    ]
    
    // Combine auto-generated and manual reminders
    const allReminders = [...autoReminders, ...manualReminders]
    
    // Remove duplicates and sort by priority
    const uniqueReminders = allReminders.filter((reminder, index, self) => 
      index === self.findIndex(r => r.id === reminder.id)
    )
    
    setReminders(uniqueReminders)
  }, [familyMembers]) // Re-run when family members change

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

    // Listen for data changes and activity updates
    window.addEventListener('dataChanged', updateData)
    window.addEventListener('activityAdded', (event: Event) => {
      const customEvent = event as CustomEvent
      const { type, action, description } = customEvent.detail
      addActivity(type, action, description)
      
      // Refresh reminders when data changes
      const autoReminders = generateAutoReminders()
      const manualReminders: Reminder[] = [
        { 
          id: '1',
          title: 'Passport expires in 30 days', 
          person: 'John Doe • 2024-02-15', 
          priority: 'high', 
          icon: FileText 
        },
        { 
          id: '2',
          title: 'Car insurance renewal', 
          person: 'Family Car • 2024-02-20', 
          priority: 'medium', 
          icon: Car 
        },
        { 
          id: '3',
          title: 'Annual checkup due', 
          person: 'Sarah Doe • 2024-02-25', 
          priority: 'low', 
          icon: Heart 
        },
        { 
          id: '4',
          title: 'Birthday coming up', 
          person: 'Mike Doe • 2024-02-18', 
          priority: 'medium', 
          icon: Bell 
        }
      ]
      
      const allReminders = [...autoReminders, ...manualReminders]
      const uniqueReminders = allReminders.filter((reminder, index, self) => 
        index === self.findIndex(r => r.id === reminder.id)
      )
      setReminders(uniqueReminders)
    })
    
    return () => {
      window.removeEventListener('dataChanged', updateData)
      window.removeEventListener('activityAdded', () => {})
    }
  }, [])

  /**
   * ========== CHAT FUNCTIONALITY - DISABLED ==========
   * CHATBOT DISABLED - Uncomment below to re-enable chatbot functionality
   */
  
  // const handleSendMessage = async () => {
  //   // Don't send if empty message or already loading
  //   if (!chatInput.trim() || isLoading) return

  //   // Create user message object
  //   const userMessage: ChatMessage = {
  //     id: Date.now().toString(),
  //     role: 'user', // Indicates this is from the user
  //     content: chatInput,
  //     timestamp: new Date().toISOString()
  //   }

  //   // Add user message to chat history immediately (optimistic UI)
  //   setChatMessages(prev => [...prev, userMessage])
  //   setChatInput('') // Clear input field
  //   setIsLoading(true) // Show loading indicator

  //   try {
  //     // Gather ALL data from localStorage for comprehensive AI context
  //     const allData = {
  //       familyMembers: familyMembers, // Family member details
  //       documents: JSON.parse(localStorage.getItem('kutum_documents') || '[]'), // All uploaded documents
  //       vehicles: JSON.parse(localStorage.getItem('kutum_vehicles') || '[]'), // Vehicle information
  //       health: JSON.parse(localStorage.getItem('kutum_health') || '[]'), // Health records
  //       activities: recentActivities, // Recent activity log
  //       reminders: reminders, // Active reminders
  //       stats: {
  //         // Summary statistics for quick answers
  //         totalFamily: peopleCount,
  //         totalDocuments: JSON.parse(localStorage.getItem('kutum_documents') || '[]').length,
  //         totalVehicles: JSON.parse(localStorage.getItem('kutum_vehicles') || '[]').length,
  //         totalReminders: reminders.length
  //       }
  //     }

  //     // Send question + all data to backend chatbot API
  //     const response = await fetch('http://localhost:8000/api/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         message: chatInput, // The user's question
  //         allData: allData // Complete context for AI
  //       })
  //     })

  //     // Check if request was successful
  //     if (!response.ok) {
  //       throw new Error('Failed to get response')
  //     }

  //     // Parse the AI response
  //     const data = await response.json()

  //     // Create assistant message object with AI's answer
  //     const assistantMessage: ChatMessage = {
  //       id: (Date.now() + 1).toString(),
  //       role: 'assistant', // Indicates this is from the AI
  //       content: data.response, // The AI's answer
  //       timestamp: data.timestamp // When the response was generated
  //     }

  //     // Add AI response to chat history
  //     setChatMessages(prev => [...prev, assistantMessage])
  //   } catch (error) {
  //     // Handle any errors (network issues, backend down, etc.)
  //     console.error('Chat error:', error)
      
  //     // Show error message to user
  //     const errorMessage: ChatMessage = {
  //       id: (Date.now() + 1).toString(),
  //       role: 'assistant',
  //       content: "Sorry, I'm having trouble connecting to the chat service. Please make sure the backend server is running at http://localhost:8000",
  //       timestamp: new Date().toISOString()
  //     }
  //     setChatMessages(prev => [...prev, errorMessage])
  //   } finally {
  //     // Always reset loading state when done
  //     setIsLoading(false)
  //   }
  // }

  /**
   * Auto-scrolls chat to bottom when new messages arrive - DISABLED
   */
  // useEffect(() => {
  //   if (showChat && chatEndRef.current) {
  //     chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
  //   }
  // }, [chatMessages, showChat])

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
    { label: 'Family Members', value: String(peopleCount), icon: Users, color: 'bg-blue-500', route: '/people' },
    { label: 'Documents', value: '24', icon: FileText, color: 'bg-green-500', route: '/documents' },
    { label: 'Vehicles', value: '2', icon: Car, color: 'bg-purple-500', route: '/vehicles' },
    { label: 'Reminders', value: String(reminders.length), icon: Bell, color: 'bg-red-500', route: '/dashboard' },
  ]



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
                <button
                  key={idx}
                  onClick={() => {
                    if (stat.label === 'Reminders') {
                      // Stay on dashboard and scroll to reminders section
                      const remindersSection = document.getElementById('reminders-section')
                      if (remindersSection) {
                        remindersSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    } else {
                      navigate(stat.route)
                    }
                  }}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer text-left w-full"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Upcoming Reminders */}
          <div id="reminders-section" className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Reminders</h2>
              <button 
                onClick={() => setShowAddReminderModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Reminder
              </button>
            </div>
            <div className={`space-y-4 ${reminders.length > 4 ? 'max-h-[412px] overflow-y-auto pr-2' : ''}`}>
              {reminders.map((reminder, idx) => {
                const Icon = reminder.icon
                
                // Calculate days left from the reminder text
                const getDaysLeft = (title: string) => {
                  const match = title.match(/(\d+)\s+days?/)
                  return match ? parseInt(match[1]) : 30 // default to 30 if no match
                }
                
                const daysLeft = getDaysLeft(reminder.title)
                const totalDays = daysLeft <= 7 ? 7 : daysLeft <= 30 ? 30 : 90 // scale based on urgency
                const percentage = Math.max(0, Math.min(100, ((totalDays - daysLeft) / totalDays) * 100))
                
                // Color based on urgency
                const getCircleColor = (days: number) => {
                  if (days <= 1) return 'stroke-red-500'
                  if (days <= 7) return 'stroke-orange-500'
                  if (days <= 30) return 'stroke-yellow-500'
                  return 'stroke-green-500'
                }
                
                return (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{reminder.title}</div>
                      <div className="text-sm text-gray-600">{reminder.person}</div>
                    </div>
                    {/* Circular Progress Indicator */}
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        {/* Background circle */}
                        <path
                          className="stroke-gray-200"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {/* Progress circle */}
                        <path
                          className={getCircleColor(daysLeft)}
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${percentage}, 100`}
                          strokeLinecap="round"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      {/* Days left text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-700">
                          {daysLeft}d
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
        
        {/* Right column */}
          <div className="lg:col-start-9 lg:col-span-4 space-y-6 mt-8">
            {/* Quick Add Button */}
            <div className="flex justify-end">
              <button 
                onClick={() => setShowQuickAddModal(true)}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Quick Add
              </button>
            </div>
            
            {/* Family Members card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Members</h3>
              <div className={`space-y-3 mb-4 ${familyMembers.length >= 4 ? 'max-h-48 overflow-y-auto pr-2' : ''}`}>
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
            {/* Recent Activities card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              </div>
              <div className={`space-y-3 ${recentActivities.length >= 4 ? 'max-h-48 overflow-y-auto pr-2' : ''}`}>
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 5).map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color.replace('text-', 'bg-').replace('-600', '-100')} flex-shrink-0 mt-0.5`}>
                          <Icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium leading-tight">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No recent activities</p>
                  </div>
                )}
              </div>
              {recentActivities.length > 5 && (
                <button className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All Activities
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========== CHATBOT UI - DISABLED ========== */}
      {/* CHATBOT DISABLED - Uncomment below to re-enable chat interface */}
      
      {/* Chat Interface */}
      {/* {showChat && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Family Assistant</h3>
            </div>
            <button 
              onClick={() => setShowChat(false)}
              className="p-1 hover:bg-emerald-800 rounded transition-colors"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your family..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !chatInput.trim()}
                className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Floating Chat Button */}
      {/* {!showChat && (
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={() => setShowChat(true)}
            className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Talk with Us
          </button>
        </div>
      )} */}

      {/* Add Reminder Modal */}
      {showAddReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Reminder</h3>
                <button
                  onClick={handleCloseReminderModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder Title
                  </label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Passport renewal"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Person/Item
                  </label>
                  <input
                    type="text"
                    value={newReminder.person}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, person: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newReminder.priority}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCloseReminderModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReminder}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Quick Add</h2>
                <button 
                  onClick={() => setShowQuickAddModal(false)}
                  className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">What would you like to add to your family records?</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleQuickAdd('family')}
                  className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Family Member</div>
                    <div className="text-sm text-gray-500">Add a new person</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickAdd('document')}
                  className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Document</div>
                    <div className="text-sm text-gray-500">Add ID, passport, etc.</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickAdd('vehicle')}
                  className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Car className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Vehicle</div>
                    <div className="text-sm text-gray-500">Add car, bike, etc.</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickAdd('health')}
                  className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Health Record</div>
                    <div className="text-sm text-gray-500">Add medical info</div>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleQuickAdd('reminder')}
                  className="w-full flex items-center justify-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Bell className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Reminder</div>
                    <div className="text-sm text-gray-500">Add a new reminder</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}