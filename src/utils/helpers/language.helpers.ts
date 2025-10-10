import { LANGUAGES, RTL_LANGUAGES } from '../constants'

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
 * Get browser language
 */
export const getBrowserLanguage = (): string => {
  const lang = navigator.language.split('-')[0]
  return Object.values(LANGUAGES).includes(lang) ? lang : LANGUAGES.EN
}

