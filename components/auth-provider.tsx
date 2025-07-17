'use client'

import { AuthProvider as SimpleAuthProvider } from '@/lib/simple-auth'
import type { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SimpleAuthProvider>
      {children}
    </SimpleAuthProvider>
  )
} 
 
 
 
 
 
 