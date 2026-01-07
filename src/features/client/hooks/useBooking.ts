import { useState, useEffect } from 'react'
import { useToast, useBooking as useBookingHook, useTimeSlot } from '@/hooks'
import { useAuth, useProfile } from '@/features/auth'



interface BookingAvailability {
  capacity: number
  booked: number
  available: number
}

export function useBooking() {
  const { user } = useAuth()
  const { profile, refreshProfile } = useProfile()
  const [bookingAvailability, setBookingAvailability] = useState<Record<string, BookingAvailability>>({})
  const [isBooking, setIsBooking] = useState(false)
  const { success, error: showError, loading: showLoading, dismiss } = useToast()
  
  const { 
    activeTimeSlots: timeSlots, 
    loading: isLoading,
    fetchActiveTimeSlots,
    fetchAvailableSpots
  } = useTimeSlot()
  
  const {
    createBooking,
    checkBookingConflict
  } = useBookingHook()

  const fetchTimeSlots = async () => {
    await fetchActiveTimeSlots()
  }

  const fetchAvailability = async (timeSlotId: string, bookingDate: string) => {
    try {
      const key = `${timeSlotId}-${bookingDate}`
      const availableSpots = await fetchAvailableSpots(timeSlotId, bookingDate)
      
      // Get the time slot to know total capacity
      const timeSlot = timeSlots.find(ts => ts.id === timeSlotId)
      const totalSpots = timeSlot?.capacity || 0
      
      const formattedAvailability = {
        capacity: totalSpots,
        booked: totalSpots - availableSpots,
        available: availableSpots
      }
      setBookingAvailability(prev => ({ ...prev, [key]: formattedAvailability }))
      return formattedAvailability
    } catch (error) {
      console.error('Error fetching availability:', error)
      return null
    }
  }

  const createUserBooking = async (timeSlotId: string, bookingDate: string) => {
    if (!user || !profile) {
      showError('Debes iniciar sesión para reservar')
      return null
    }

    if (profile.credits <= 0) {
      showError('No tienes créditos suficientes para reservar')
      return null
    }

    try {
      setIsBooking(true)
      const loadingToast = showLoading('Procesando reserva...')

      const hasConflict = await checkBookingConflict(user.id, timeSlotId, bookingDate)
      if (hasConflict) {
        showError('Ya tienes una reserva para esta fecha y horario')
        return null
      }

      const availability = await fetchAvailability(timeSlotId, bookingDate)
      if (!availability || availability.available <= 0) {
        showError('No hay plazas disponibles para esta fecha y horario')
        return null
      }

      const booking = await createBooking({
        user_id: user.id,
        time_slot_id: timeSlotId,
        booking_date: bookingDate,
        status: 'confirmed'
      })
      
      await refreshProfile()
      await fetchAvailability(timeSlotId, bookingDate)
      
      dismiss(loadingToast)
      success('¡Reserva realizada con éxito!')
      
      return booking
    } catch (error) {
      console.error('Error creating booking:', error)
      showError('Error al realizar la reserva')
      return null
    } finally {
      setIsBooking(false)
    }
  }

  const getAvailabilityKey = (timeSlotId: string, bookingDate: string) => {
    return `${timeSlotId}-${bookingDate}`
  }

  const getAvailability = (timeSlotId: string, bookingDate: string) => {
    const key = getAvailabilityKey(timeSlotId, bookingDate)
    return bookingAvailability[key] || null
  }

  useEffect(() => {
    fetchTimeSlots()
  }, [fetchActiveTimeSlots])

  return {
    timeSlots,
    isLoading,
    isBooking,
    createBooking: createUserBooking,
    fetchAvailability,
    getAvailability,
    refreshTimeSlots: fetchTimeSlots
  }
}
