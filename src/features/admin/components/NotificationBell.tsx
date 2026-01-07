import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotificationStore } from '@/stores/notificationStore'

interface NotificationBellProps {
  isAdmin: boolean
  onMarkAsSeen: () => void
}

export function NotificationBell({ isAdmin, onMarkAsSeen }: NotificationBellProps) {
  const navigate = useNavigate()
  const { newBookingsCount } = useNotificationStore()

  const handleClick = () => {
    onMarkAsSeen()
    navigate('/admin/bookings')
  }

  if (!isAdmin || newBookingsCount === 0) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={handleClick}
      title={`${newBookingsCount} nueva${newBookingsCount > 1 ? 's' : ''} reserva${newBookingsCount > 1 ? 's' : ''}`}
    >
      <Bell className="h-5 w-5" />
      <Badge
        variant="destructive"
        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
      >
        {newBookingsCount > 9 ? '9+' : newBookingsCount}
      </Badge>
    </Button>
  )
}
