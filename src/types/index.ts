// Global Type Definitions

export type Language = 'en' | 'he'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
}

export interface SidebarProps {
  isOpen?: boolean
  isCollapsed?: boolean
  onToggle?: (isOpen: boolean, isCollapsed: boolean) => void
  isRTL?: boolean
}

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
  height: number
}

