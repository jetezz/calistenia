import { useCallback } from 'react'
import { useTimeSlotStore } from '@/stores'
import { timeSlotService } from '@/services'
import type { Database } from '@/types/database'


type TimeSlotInsert = Database['public']['Tables']['time_slots']['Insert']
type TimeSlotUpdate = Database['public']['Tables']['time_slots']['Update']

export const useTimeSlot = () => {
  const {
    timeSlots,
    activeTimeSlots,
    currentTimeSlot,
    availabilityCache,
    loading,
    error,
    setTimeSlots,
    setActiveTimeSlots,
    setCurrentTimeSlot,
    addTimeSlot,
    updateTimeSlot,
    removeTimeSlot,
    setAvailability,
    getAvailability,
    setLoading,
    setError,
  } = useTimeSlotStore()

  const fetchTimeSlots = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await timeSlotService.getAll()
      setTimeSlots(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch time slots')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchActiveTimeSlots = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await timeSlotService.getActive()
      setActiveTimeSlots(data)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch active time slots')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRecurringSlots = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await timeSlotService.getRecurringSlots()
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch recurring slots')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSpecificDateSlots = useCallback(async (fromDate?: string, toDate?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await timeSlotService.getSpecificDateSlots(fromDate, toDate)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch specific date slots')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const getAvailableDatesInRange = useCallback(async (fromDate: string, toDate: string) => {
    try {
      const data = await timeSlotService.getAvailableDatesInRange(fromDate, toDate)
      return data
    } catch (error) {
      throw error
    }
  }, [])

  const fetchTimeSlotById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await timeSlotService.getById(id)
      setCurrentTimeSlot(data)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch time slot')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTimeSlotsByDay = useCallback(async (dayOfWeek: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await timeSlotService.getByDayOfWeek(dayOfWeek)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch time slots by day')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAvailableSpots = useCallback(async (slotId: string, targetDate: string) => {
    const cached = getAvailability(slotId, targetDate)
    if (cached !== undefined) {
      return cached
    }

    try {
      const spots = await timeSlotService.getAvailableSpots(slotId, targetDate)
      setAvailability(slotId, targetDate, spots)
      return spots
    } catch (error) {
      throw error
    }
  }, [getAvailability, setAvailability])

  const createTimeSlot = useCallback(async (timeSlotData: TimeSlotInsert) => {
    setLoading(true)
    setError(null)
    try {
      const newTimeSlot = await timeSlotService.create(timeSlotData)
      addTimeSlot(newTimeSlot)
      return newTimeSlot
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create time slot')
      throw error
    } finally {
      setLoading(false)
    }
  }, [addTimeSlot])

  const updateTimeSlotData = useCallback(async (id: string, updates: TimeSlotUpdate) => {
    setLoading(true)
    setError(null)
    try {
      const updatedTimeSlot = await timeSlotService.update(id, updates)
      updateTimeSlot(id, updatedTimeSlot)
      return updatedTimeSlot
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update time slot')
      throw error
    } finally {
      setLoading(false)
    }
  }, [updateTimeSlot])

  const toggleTimeSlotActive = useCallback(async (id: string, isActive: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const updatedTimeSlot = await timeSlotService.toggleActive(id, isActive)
      updateTimeSlot(id, updatedTimeSlot)
      return updatedTimeSlot
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to toggle time slot status')
      throw error
    } finally {
      setLoading(false)
    }
  }, [updateTimeSlot])

  const deleteTimeSlot = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await timeSlotService.delete(id)
      removeTimeSlot(id)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete time slot')
      throw error
    } finally {
      setLoading(false)
    }
  }, [removeTimeSlot])

  return {
    // State
    timeSlots,
    activeTimeSlots,
    currentTimeSlot,
    availabilityCache,
    loading,
    error,

    // Actions
    fetchTimeSlots,
    fetchActiveTimeSlots,
    fetchRecurringSlots,
    fetchSpecificDateSlots,
    getAvailableDatesInRange,
    fetchTimeSlotById,
    fetchTimeSlotsByDay,
    fetchAvailableSpots,
    createTimeSlot,
    updateTimeSlot: updateTimeSlotData,
    toggleTimeSlotActive,
    deleteTimeSlot,
    setCurrentTimeSlot,
  }
}
