/**
 * Admin Chatbot Component
 * AI-powered chatbot for admin portal that can retrieve and analyze admin data
 */

import {
  adminService,
  bloodGroupService,
  clothingSizeService,
  documentTypeService,
  relationTypeService,
  shoeSizeService,
} from '@/utils/api'
import { Bot, MessageCircle, Send, User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AdminChatbotProps {
  isOpen: boolean
  onToggle: () => void
}

export default function AdminChatbot({ isOpen, onToggle }: AdminChatbotProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Debug log to verify component is rendering
  console.log('AdminChatbot rendering:', { isOpen })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, isOpen])

  /**
   * Handle sending a message to the chatbot
   * Gathers admin data and sends to backend for AI processing
   */
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return

    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    }

    // Add user message to chat
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsLoading(true)

    try {
      // Gather admin data from backend APIs
      const adminData = await gatherAdminData()
      console.log('Sending to chatbot API:', { message: chatInput, adminData })

      // Send to chatbot API
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatInput,
          allData: adminData
        })
      })
      
      console.log('Chatbot API response status:', response.status)

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      console.log('Chatbot API response data:', data)

      // Add AI response to chat
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp
      }

      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting to the chat service. Please make sure the backend server is running at http://localhost:8000",
        timestamp: new Date().toISOString()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Gather all admin data from backend APIs
   */
  const gatherAdminData = async () => {
    try {
      console.log('Gathering admin data from APIs...')
      
      // Get all admin data in parallel using proper API services
      const [users, bloodGroups, documentTypes, relationTypes, clothingSizes, shoeSizes] =
        await Promise.all([
          adminService.getAllUsers({ page: 1, limit: 100 }),
          bloodGroupService.getAll({ page: 1, limit: 100 }),
          documentTypeService.getAll({ page: 1, limit: 100 }),
          relationTypeService.getAll({ page: 1, limit: 100 }),
          clothingSizeService.getAll({ page: 1, limit: 100 }),
          shoeSizeService.getAll({ page: 1, limit: 100 }),
        ])

      const adminData = {
        users: users.items || [],
        bloodGroups: bloodGroups.items || [],
        documentTypes: documentTypes.items || [],
        relationTypes: relationTypes.items || [],
        clothingSizes: clothingSizes.items || [],
        shoeSizes: shoeSizes.items || [],
        stats: {
          totalUsers: users.meta?.totalItems || 0,
          totalBloodGroups: bloodGroups.meta?.totalItems || 0,
          totalDocumentTypes: documentTypes.meta?.totalItems || 0,
          totalRelationTypes: relationTypes.meta?.totalItems || 0,
          totalClothingSizes: clothingSizes.meta?.totalItems || 0,
          totalShoeSizes: shoeSizes.meta?.totalItems || 0,
          activeUsers: users.items?.filter((user: any) => user.is_active).length || 0,
          adminUsers: users.items?.filter((user: any) => user.role === 'admin').length || 0,
          normalUsers: users.items?.filter((user: any) => user.role === 'normal').length || 0,
        },
      }

      console.log('Admin data gathered successfully:', adminData)
      return adminData
    } catch (error) {
      console.error('Error gathering admin data:', error)
      toast.error('Failed to gather admin data')
      return {
        users: [],
        bloodGroups: [],
        documentTypes: [],
        relationTypes: [],
        clothingSizes: [],
        shoeSizes: [],
        stats: {},
      }
    }
  }

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white flex items-center justify-center border-2 border-white`}
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-purple-600 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-semibold">Admin Assistant</h3>
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Ask me anything about your admin data!</p>
                <div className="mt-4 space-y-2 text-xs text-gray-400">
                  <p>• "How many users are registered?"</p>
                  <p>• "Show me all blood groups"</p>
                  <p>• "What document types are available?"</p>
                  <p>• "Give me a system overview"</p>
                </div>
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about admin data..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isLoading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
