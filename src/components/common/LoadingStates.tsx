import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-6', 
    lg: 'size-8'
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin text-muted-foreground',
        sizeClasses[size],
        className
      )} 
    />
  )
}

interface LoadingStateProps {
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingState({ 
  message = 'Cargando...', 
  className,
  size = 'md' 
}: LoadingStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3 p-8 text-center',
      className
    )}>
      <LoadingSpinner size={size} />
      <p className="text-sm text-muted-foreground font-medium">
        {message}
      </p>
    </div>
  )
}

export function PageLoadingState({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold text-primary">Calistenia Emérita</div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <LoadingSpinner size="sm" />
          <span className="text-sm">{message}</span>
        </div>
      </div>
    </div>
  )
}
