import { useEffect } from 'react'
import { useNotificationStore } from '@/stores/notificationStore'

const SEEN_BOOKINGS_KEY = 'admin_seen_bookings'

export const useNotifications = (isAdmin: boolean, totalBookings: number) => {
  const { newBookingsCount, setNewBookingsCount } = useNotificationStore()

  useEffect(() => {
    if (!isAdmin) return

    const seenCount = parseInt(sessionStorage.getItem(SEEN_BOOKINGS_KEY) || '0', 10)
    const newCount = Math.max(0, totalBookings - seenCount)
    
    if (newCount !== newBookingsCount) {
      setNewBookingsCount(newCount)
    }
  }, [isAdmin, totalBookings, newBookingsCount, setNewBookingsCount])

  const markAsSeen = () => {
    sessionStorage.setItem(SEEN_BOOKINGS_KEY, totalBookings.toString())
    setNewBookingsCount(0)
  }

  return {
    newBookingsCount,
    markAsSeen,
  }
}
