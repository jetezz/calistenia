import { useEffect, useCallback } from 'react'
import { useTimeSlot } from '@/hooks'
import { useToast } from '@/hooks'
import type { Database } from '@/types/database'


type TimeSlotInsert = Database['public']['Tables']['time_slots']['Insert']
type TimeSlotUpdate = Database['public']['Tables']['time_slots']['Update']

export function useTimeSlots() {
  const {
    timeSlots,
    loading: isLoading,
    error,
    fetchTimeSlots,
    createTimeSlot: createSlot,
    updateTimeSlot: updateSlot,
    toggleTimeSlotActive,
    deleteTimeSlot: deleteSlot,
  } = useTimeSlot()
  
  const { success, error: showError } = useToast()

  const refreshTimeSlots = useCallback(async () => {
    try {
      await fetchTimeSlots()
    } catch (error) {
      console.error('Error fetching time slots:', error)
      showError('Error al cargar los horarios')
    }
  }, [fetchTimeSlots, showError])

  const createTimeSlot = useCallback(async (timeSlot: TimeSlotInsert) => {
    try {
      const newSlot = await createSlot(timeSlot)
      success('Horario creado correctamente')
      return newSlot
    } catch (error) {
      console.error('Error creating time slot:', error)
      showError('Error al crear el horario')
      throw error
    }
  }, [createSlot, success, showError])

  const updateTimeSlot = useCallback(async (id: string, updates: TimeSlotUpdate) => {
    try {
      const updatedSlot = await updateSlot(id, updates)
      success('Horario actualizado correctamente')
      return updatedSlot
    } catch (error) {
      console.error('Error updating time slot:', error)
      showError('Error al actualizar el horario')
      throw error
    }
  }, [updateSlot, success, showError])

  const toggleSlotActive = useCallback(async (id: string, isActive: boolean) => {
    try {
      await toggleTimeSlotActive(id, isActive)
      success(`Horario ${isActive ? 'activado' : 'desactivado'} correctamente`)
    } catch (error) {
      console.error('Error toggling time slot:', error)
      showError('Error al cambiar el estado del horario')
      throw error
    }
  }, [toggleTimeSlotActive, success, showError])

  const deleteTimeSlot = useCallback(async (id: string) => {
    try {
      await deleteSlot(id)
      success('Horario eliminado correctamente')
    } catch (error) {
      console.error('Error deleting time slot:', error)
      showError('Error al eliminar el horario')
      throw error
    }
  }, [deleteSlot, success, showError])

  useEffect(() => {
    refreshTimeSlots()
  }, [refreshTimeSlots])

  return {
    timeSlots,
    isLoading,
    error,
    refreshTimeSlots,
    createTimeSlot,
    updateTimeSlot,
    toggleTimeSlotActive: toggleSlotActive,
    deleteTimeSlot,
  }
}
