'use client'

import { createContext, useContext, ReactNode } from 'react'

interface SidebarContextType {
  // Empty for now - can be extended with sidebar state if needed
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  return (
    <SidebarContext.Provider value={{}}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
