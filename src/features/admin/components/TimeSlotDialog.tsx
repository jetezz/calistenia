import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/common'
import { useTimeSlotDialog } from './hooks'
import type { Database } from '@/types/database'

type TimeSlot = Database['public']['Tables']['time_slots']['Row']

interface TimeSlotDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingSlot?: TimeSlot | null
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' }
]

export function TimeSlotDialog({ isOpen, onClose, onSuccess, editingSlot }: TimeSlotDialogProps) {
  const [error, setError] = useState<string | null>(null)
  
  const { 
    formData, 
    isLoading, 
    updateField, 
    handleSave, 
    resetForm 
  } = useTimeSlotDialog({
    editingSlot,
    onSuccess: () => {
      onSuccess()
      onClose()
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      await handleSave()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al guardar el horario')
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      resetForm()
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingSlot ? 'Editar Horario' : 'Crear Horario'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="day">Día de la semana</Label>
            <Select
              value={formData.day_of_week.toString()}
              onValueChange={(value) => updateField('day_of_week', parseInt(value))}
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day.value} value={day.value.toString()}>
                  {day.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start_time">Hora de inicio</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => updateField('start_time', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">Hora de fin</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => updateField('end_time', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacidad máxima</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="20"
              value={formData.capacity}
              onChange={(e) => updateField('capacity', parseInt(e.target.value) || 1)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => updateField('is_active', e.target.checked)}
              disabled={isLoading}
              className="rounded border-input"
            />
            <Label htmlFor="is_active" className="text-sm">
              Horario activo (disponible para reservas)
            </Label>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Guardando...</span>
                </div>
              ) : (
                editingSlot ? 'Actualizar' : 'Crear'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
