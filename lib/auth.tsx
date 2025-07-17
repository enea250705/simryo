'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

// Simple wrapper component for NextAuth SessionProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}