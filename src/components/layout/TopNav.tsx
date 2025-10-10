/**
 * ========================================
 * TOP NAVIGATION BAR
 * ========================================
 * 
 * Main navigation component shown at the top of every page
 * 
 * Features:
 * - Role-based menu items (admin vs user)
 * - User profile dropdown
 * - Settings dropdown
 * - Mobile responsive menu
 * - Active route highlighting
 * - Logout functionality
 * 
 * Props:
 * - role: 'admin' | 'user' - Determines which navigation items to show
 */

import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LayoutDashboard, Heart, FileText, Users, Shirt, Bell, LogOut, Car, Menu, X, Settings, TrendingUp } from 'lucide-react'
// Import logo (TypeScript may show error, but file exists)
import logo from '@/assets/kutum-logo.png'

type Role = 'admin' | 'user'

/**
 * TopNav Component
 * Renders navigation bar with role-specific menu items
 * 
 * @param role - User role ('admin' or 'user') to determine menu items
 */
export default function TopNav({ role }: { role: Role }) {
  // ========== STATE & HOOKS ==========
  const { user, logout } = useAuth() // Get current user and logout function
  const [profileOpen, setProfileOpen] = useState(false) // Controls profile dropdown visibility
  const [settingsOpen, setSettingsOpen] = useState(false) // Controls settings dropdown visibility
  const [mobileOpen, setMobileOpen] = useState(false) // Controls mobile menu visibility
  const profileRef = useRef<HTMLDivElement>(null) // Reference for click-outside detection
  const settingsRef = useRef<HTMLDivElement>(null) // Reference for click-outside detection
  const navigate = useNavigate() // For programmatic navigation
  const location = useLocation() // Get current route for active highlighting

  /**
   * Close dropdowns when clicking outside
   * Improves UX by auto-closing menus when user clicks elsewhere
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close profile dropdown if clicking outside
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
      // Close settings dropdown if clicking outside
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false)
      }
    }
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)
    
    // Cleanup on unmount
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ========== NAVIGATION ITEMS ==========
  
  // Admin navigation items - System configuration pages
  const adminItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Trends', href: '/admin-trends', icon: TrendingUp },
    { name: 'Blood Groups', href: '/blood-groups', icon: Heart },
    { name: 'Documents', href: '/document-types', icon: FileText },
    { name: 'Relation Types', href: '/relation-types', icon: Users },
    { name: 'Clothing Sizes', href: '/clothing-sizes', icon: Shirt },
  ]

  // User navigation items - Family management features
  const userItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Users }, // Includes AI chatbot
    { name: 'People', href: '/people', icon: Users }, // Family member profiles
    { name: 'Documents', href: '/documents', icon: FileText }, // AI document scanner
    { name: 'Vehicles', href: '/vehicles', icon: Car }, // Vehicle tracking
    { name: 'Health', href: '/health', icon: Heart }, // Health records
  ]

  // Select appropriate menu based on user role
  const items = role === 'admin' ? adminItems : userItems
  
  // Helper function to check if current route is active (for highlighting)
  const isActive = (href: string) => location.pathname === href

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Mobile hamburger */}
            <button
              className="p-2 -ml-2 md:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <img 
                src={logo} 
                alt="Kutum Logo" 
                className="w-12 h-12 rounded-lg object-cover"
              />
            </button>
            <nav className="hidden md:flex items-center gap-6">
              {items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                const isDisabled = item.href === '#'
                return (
                  <button
                    key={item.name}
                    onClick={() => !isDisabled && navigate(item.href)}
                    className={
                      active
                        ? 'flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium'
                        : isDisabled
                          ? 'flex items-center gap-2 px-3 py-2 text-gray-400 cursor-not-allowed'
                          : 'flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg'
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
            </button>
            <div className="relative" ref={settingsRef}>
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                onClick={() => setSettingsOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={settingsOpen}
              >
                <Settings className="h-5 w-5" />
              </button>
              {settingsOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => {
                      setSettingsOpen(false)
                      // Add settings navigation here if needed
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
              )}
            </div>
            <div className="relative" ref={profileRef}>
              <button
                className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                onClick={() => setProfileOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="text-white font-medium text-sm">{user?.firstName?.[0] ?? 'A'}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 sm:px-6 py-2 space-y-1">
            {items.map((item) => {
              const Icon = item.icon
              const isDisabled = item.href === '#'
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (!isDisabled) {
                      navigate(item.href)
                      setMobileOpen(false)
                    }
                  }}
                  className={
                    isDisabled
                      ? 'w-full flex items-center gap-3 px-3 py-2 text-left text-gray-400 cursor-not-allowed'
                      : 'w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg'
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}


