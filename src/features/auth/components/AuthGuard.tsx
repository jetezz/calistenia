import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { PageLoadingState } from '@/components/common'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading: authLoading } = useAuth()
  const { profile, isLoading: profileLoading, isAdmin, isApproved, isPending, isRejected } = useProfile()
  const location = useLocation()

  if (authLoading || profileLoading) {
    return <PageLoadingState message="Iniciando sesión..." />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si no se cargó el perfil, mostrar loading
  if (!profile) {
    return <PageLoadingState message="Cargando perfil..." />
  }

  // Admin siempre puede acceder sin restricciones (ignorar approval_status)
  if (profile.role === 'admin') {
    return <>{children}</>
  }

  // Para usuarios regulares, verificar approval_status
  // Usuario rechazado no puede acceder
  if (isRejected) {
    return <Navigate to="/rejected" replace />
  }

  // Usuario pendiente de aprobación
  if (isPending) {
    return <Navigate to="/pending-approval" replace />
  }

  // Usuario aprobado puede acceder
  if (isApproved) {
    return <>{children}</>
  }

  // Fallback: si no tiene approval_status definido, redirigir a pending
  return <Navigate to="/pending-approval" replace />
}
