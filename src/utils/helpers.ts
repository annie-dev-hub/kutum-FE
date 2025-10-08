// Helper Utility Functions

import { LANGUAGES, RTL_LANGUAGES } from './constants'

/**
 * Check if a language is RTL
 */
export const isRTLLanguage = (lang: string): boolean => {
  return RTL_LANGUAGES.includes(lang as any)
}

/**
 * Get the opposite direction
 */
export const getOppositeDirection = (dir: 'ltr' | 'rtl'): 'ltr' | 'rtl' => {
  return dir === 'ltr' ? 'rtl' : 'ltr'
}

/**
 * Format user's full name
 */
export const getFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim()
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return emailRegex.test(email)
}

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{9,15}$/
  return phoneRegex.test(phone)
}

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Sleep/delay function
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Get browser language
 */
export const getBrowserLanguage = (): string => {
  const lang = navigator.language.split('-')[0]
  return Object.values(LANGUAGES).includes(lang) ? lang : LANGUAGES.EN
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

