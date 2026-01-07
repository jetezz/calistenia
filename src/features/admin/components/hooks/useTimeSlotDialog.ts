import { useState } from 'react'
import { useTimeSlot } from '@/hooks'
import type { Database } from '@/types/database'

type TimeSlot = Database['public']['Tables']['time_slots']['Row']
type TimeSlotInsert = Database['public']['Tables']['time_slots']['Insert']

interface UseTimeSlotDialogProps {
  editingSlot?: TimeSlot | null
  onSuccess?: () => void
}

export const useTimeSlotDialog = ({ editingSlot, onSuccess }: UseTimeSlotDialogProps = {}) => {
  const [formData, setFormData] = useState({
    day_of_week: editingSlot?.day_of_week ?? 1,
    start_time: editingSlot?.start_time ?? '09:00',
    end_time: editingSlot?.end_time ?? '10:00',
    capacity: editingSlot?.capacity ?? 4,
    is_active: editingSlot?.is_active ?? true
  })
  const [isLoading, setIsLoading] = useState(false)
  
  const { createTimeSlot, updateTimeSlot } = useTimeSlot()

  const resetForm = () => {
    setFormData({
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:00',
      capacity: 4,
      is_active: true
    })
  }

  const validateForm = () => {
    if (formData.start_time >= formData.end_time) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin')
    }
    
    if (formData.capacity < 1) {
      throw new Error('La capacidad debe ser mayor a 0')
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      validateForm()
      
      const timeSlotData: TimeSlotInsert = {
        day_of_week: formData.day_of_week,
        start_time: formData.start_time,
        end_time: formData.end_time,
        capacity: formData.capacity,
        is_active: formData.is_active
      }

      if (editingSlot) {
        await updateTimeSlot(editingSlot.id, timeSlotData)
      } else {
        await createTimeSlot(timeSlotData)
      }

      resetForm()
      onSuccess?.()
    } catch (error) {
      throw error // Let the component handle the error display
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return {
    formData,
    isLoading,
    updateField,
    handleSave,
    resetForm
  }
}
