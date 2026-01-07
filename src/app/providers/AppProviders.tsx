import type { ReactNode } from 'react'
import { AuthProvider } from '@/features/auth'
import { Toaster } from '@/components/ui/sonner'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-center" richColors />
    </AuthProvider>
  )
}
