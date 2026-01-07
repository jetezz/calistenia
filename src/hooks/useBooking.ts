import { useCallback } from 'react'
import { useBookingStore } from '@/stores'
import { bookingService } from '@/services'
import type { Database } from '@/types/database'

type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export const useBooking = () => {
  const {
    bookings,
    currentBooking,
    userBookings,
    upcomingBookings,
    loading,
    error,
    setBookings,
    setCurrentBooking,
    setUserBookings,
    setUpcomingBookings,
    addBooking,
    updateBooking,
    removeBooking,
    setLoading,
    setError,
  } = useBookingStore()

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await bookingService.getAll()
      setBookings(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setBookings])

  const fetchBookingById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await bookingService.getById(id)
      setCurrentBooking(data)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch booking')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setCurrentBooking])

  const fetchUserBookings = useCallback(async (userId: string, limit?: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await bookingService.getByUserId(userId, limit)
      setUserBookings(data)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch user bookings')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setUserBookings])

  const fetchUpcomingBookings = useCallback(async (userId: string, limit?: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await bookingService.getUpcomingByUserId(userId, limit)
      setUpcomingBookings(data)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch upcoming bookings')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setUpcomingBookings])

  const fetchBookingsByDateRange = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await bookingService.getByDateRange(startDate, endDate)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch bookings by date range')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  const createBooking = useCallback(async (bookingData: BookingInsert) => {
    setLoading(true)
    setError(null)
    try {
      const newBooking = await bookingService.create(bookingData)
      addBooking(newBooking)
      return newBooking
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create booking')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, addBooking])

  const updateBookingData = useCallback(async (id: string, updates: BookingUpdate) => {
    setLoading(true)
    setError(null)
    try {
      const updatedBooking = await bookingService.update(id, updates)
      updateBooking(id, updatedBooking)
      return updatedBooking
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update booking')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, updateBooking])

  const cancelBooking = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const cancelledBooking = await bookingService.cancel(id)
      updateBooking(id, cancelledBooking)
      return cancelledBooking
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to cancel booking')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, updateBooking])

  const deleteBooking = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await bookingService.delete(id)
      removeBooking(id)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete booking')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, removeBooking])

  const checkBookingConflict = useCallback(async (userId: string, timeSlotId: string, bookingDate: string) => {
    try {
      return await bookingService.checkBookingConflict(userId, timeSlotId, bookingDate)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to check booking conflict')
      throw error
    }
  }, [setError])

  return {
    // State
    bookings,
    currentBooking,
    userBookings,
    upcomingBookings,
    loading,
    error,

    // Actions
    fetchBookings,
    fetchBookingById,
    fetchUserBookings,
    fetchUpcomingBookings,
    fetchBookingsByDateRange,
    createBooking,
    updateBooking: updateBookingData,
    cancelBooking,
    deleteBooking,
    checkBookingConflict,
    setCurrentBooking,
  }
}
