import { useEffect } from 'react'
import { useToast, useBooking, useAppSettings } from '@/hooks'
import { useAuth, useProfile } from '@/features/auth'
import type { Database } from '@/types/database'

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  time_slot: Database['public']['Tables']['time_slots']['Row']
}

export function useUserBookings() {
  const { user } = useAuth()
  const { refreshProfile } = useProfile()
  const { success, error: showError } = useToast()
  const { getCancellationPolicy } = useAppSettings()
  
  const {
    userBookings: bookings,
    loading: isLoading,
    fetchUserBookings,
    cancelBooking: cancelUserBooking
  } = useBooking()

  const fetchBookings = async () => {
    if (!user) return

    try {
      await fetchUserBookings(user.id)
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      showError('Error al cargar tus reservas')
    }
  }

  const cancelBooking = async (bookingId: string) => {
    if (!user) return

    try {
      await cancelUserBooking(bookingId)
      success('Reserva cancelada correctamente. Crédito devuelto')
      await fetchUserBookings(user.id)
      await refreshProfile()
    } catch (error) {
      console.error('Error cancelling booking:', error)
      showError('Error al cancelar la reserva')
    }
  }

  const getUpcomingBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date)
      bookingDate.setHours(0, 0, 0, 0)
      return bookingDate >= today && booking.status !== 'cancelled'
    }).sort((a, b) => a.booking_date.localeCompare(b.booking_date))
  }

  const getPastBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date)
      bookingDate.setHours(0, 0, 0, 0)
      return bookingDate < today || booking.status === 'cancelled'
    }).sort((a, b) => b.booking_date.localeCompare(a.booking_date))
  }

  const canCancelBooking = (booking: Booking) => {
    if (booking.status !== 'confirmed') return false
    
    const policy = getCancellationPolicy()
    
    if (policy.value === 0) return true
    
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.time_slot.start_time}`)
    const now = new Date()
    
    let minAdvanceTime: number
    if (policy.unit === 'hours') {
      minAdvanceTime = policy.value
    } else {
      minAdvanceTime = policy.value * 24
    }
    
    const hoursDiff = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    return hoursDiff > minAdvanceTime
  }

  useEffect(() => {
    fetchBookings()
  }, [user])

  return {
    bookings,
    upcomingBookings: getUpcomingBookings(),
    pastBookings: getPastBookings(),
    isLoading,
    isCancelling: null, // Change to null to indicate no booking is being cancelled
    cancelBooking,
    canCancelBooking,
    refreshBookings: fetchBookings
  }
}
