import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LayoutDashboard, Heart, FileText, Users, Shirt, Bell, Settings, LogOut, Car, Menu, X } from 'lucide-react'
import logo from '@/assets/logo.jpg'

type Role = 'admin' | 'user'

export default function TopNav({ role }: { role: Role }) {
  const { user, logout } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const adminItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Blood Groups', href: '/blood-groups', icon: Heart },
    { name: 'Documents', href: '/document-types', icon: FileText },
    { name: 'Relation Types', href: '/relation-types', icon: Users },
    { name: 'Clothing Sizes', href: '/clothing-sizes', icon: Shirt },
  ]

  const userItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Users },
    { name: 'People', href: '/people', icon: Users },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Health', href: '/health', icon: Heart },
  ]

  const items = role === 'admin' ? adminItems : userItems
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
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="Kutum Logo" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-xl font-bold text-gray-900">Kutum</span>
            </div>
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
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">{user?.firstName?.[0] ?? 'A'}</span>
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


