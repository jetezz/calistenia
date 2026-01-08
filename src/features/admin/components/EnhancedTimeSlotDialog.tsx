import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/common'
import { useAuth } from '@/features/auth'
import { useTimeSlot } from '@/hooks'
import type { Database } from '@/types/database'
import { toast } from 'sonner'

type TimeSlot = Database['public']['Tables']['time_slots']['Row']
type TimeSlotInsert = Database['public']['Tables']['time_slots']['Insert']

interface TimeSlotDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingSlot?: TimeSlot | null
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
  { value: 0, label: 'Dom' }
]

export function EnhancedTimeSlotDialog({ isOpen, onClose, onSuccess, editingSlot }: TimeSlotDialogProps) {
  const { user } = useAuth()
  const { createTimeSlot, updateTimeSlot: updateTimeSlotData, loading: isLoading } = useTimeSlot()
  
  const [scheduleType, setScheduleType] = useState<'recurring' | 'specific_date'>(
    editingSlot?.slot_type === 'specific_date' ? 'specific_date' : 'recurring'
  )
  
  const [recurringData, setRecurringData] = useState({
    selectedDays: editingSlot?.slot_type === 'recurring' ? [editingSlot.day_of_week] : [],
    startTime: editingSlot?.start_time || '',
    endTime: editingSlot?.end_time || '',
    capacity: editingSlot?.capacity || 4
  })
  
  const [specificData, setSpecificData] = useState({
    specificDate: editingSlot?.specific_date || '',
    startTime: editingSlot?.start_time || '',
    endTime: editingSlot?.end_time || '',
    capacity: editingSlot?.capacity || 4
  })
  
  const [error, setError] = useState<string | null>(null)

  const handleDayToggle = (dayValue: number, checked: boolean) => {
    setRecurringData(prev => ({
      ...prev,
      selectedDays: checked 
        ? [...prev.selectedDays, dayValue]
        : prev.selectedDays.filter(d => d !== dayValue)
    }))
  }

  const validateRecurringForm = () => {
    if (recurringData.selectedDays.length === 0) {
      setError('Selecciona al menos un día de la semana')
      return false
    }
    if (!recurringData.startTime || !recurringData.endTime) {
      setError('Completa las horas de inicio y fin')
      return false
    }
    if (recurringData.startTime >= recurringData.endTime) {
      setError('La hora de fin debe ser posterior a la de inicio')
      return false
    }
    return true
  }

  const validateSpecificForm = () => {
    if (!specificData.specificDate) {
      setError('Selecciona una fecha específica')
      return false
    }
    if (!specificData.startTime || !specificData.endTime) {
      setError('Completa las horas de inicio y fin')
      return false
    }
    if (specificData.startTime >= specificData.endTime) {
      setError('La hora de fin debe ser posterior a la de inicio')
      return false
    }
    const selectedDate = new Date(specificData.specificDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      setError('No puedes crear horarios para fechas pasadas')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (scheduleType === 'recurring' && !validateRecurringForm()) return
    if (scheduleType === 'specific_date' && !validateSpecificForm()) return

    try {
      if (editingSlot) {
        // Edit existing slot - only allow basic property updates
        const updates: any = {
          is_active: true,
          capacity: scheduleType === 'recurring' ? recurringData.capacity : specificData.capacity
        }
        
        await updateTimeSlotData(editingSlot.id, updates)
        toast.success('Horario actualizado correctamente')
      } else {
        // Create new slots
        if (scheduleType === 'recurring') {
          // Create multiple slots, one for each selected day
          const slotsToCreate = recurringData.selectedDays.map(dayOfWeek => ({
            slot_type: 'recurring' as const,
            day_of_week: dayOfWeek,
            specific_date: null,
            start_time: recurringData.startTime,
            end_time: recurringData.endTime,
            capacity: recurringData.capacity,
            is_active: true,
            created_by: user?.id || null
          }))

          for (const slot of slotsToCreate) {
            await createTimeSlot(slot)
          }
          
          toast.success(`${slotsToCreate.length} horarios recurrentes creados`)
        } else {
          // Create single specific date slot
          const slotData: TimeSlotInsert = {
            slot_type: 'specific_date',
            day_of_week: new Date(specificData.specificDate).getDay(),
            specific_date: specificData.specificDate,
            start_time: specificData.startTime,
            end_time: specificData.endTime,
            capacity: specificData.capacity,
            is_active: true,
            created_by: user?.id || null
          }

          await createTimeSlot(slotData)
          toast.success('Horario específico creado correctamente')
        }
      }

      onSuccess()
      onClose()
      
      // Reset form
      setRecurringData({
        selectedDays: [],
        startTime: '',
        endTime: '',
        capacity: 4
      })
      setSpecificData({
        specificDate: '',
        startTime: '',
        endTime: '',
        capacity: 4
      })
      
    } catch (error) {
      console.error('Error saving time slot:', error)
      setError('Error al guardar el horario. Inténtalo de nuevo.')
    }
  }

  const resetForm = () => {
    setError(null)
    setScheduleType('recurring')
    setRecurringData({
      selectedDays: [],
      startTime: '',
      endTime: '',
      capacity: 4
    })
    setSpecificData({
      specificDate: '',
      startTime: '',
      endTime: '',
      capacity: 4
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            {editingSlot ? 'Editar Horario' : 'Crear Nuevo Horario'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!editingSlot && (
            <Tabs value={scheduleType} onValueChange={(value: any) => setScheduleType(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recurring" className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Horario Semanal
                </TabsTrigger>
                <TabsTrigger value="specific_date" className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Día Específico
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recurring" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Horario Recurrente Semanal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label>Selecciona los días de la semana</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {DAYS_OF_WEEK.map((day) => (
                          <div key={day.value} className="flex flex-col items-center space-y-2">
                            <Checkbox
                              id={`day-${day.value}`}
                              checked={recurringData.selectedDays.includes(day.value)}
                              onCheckedChange={(checked) => 
                                handleDayToggle(day.value, checked === true)
                              }
                            />
                            <Label 
                              htmlFor={`day-${day.value}`}
                              className="text-xs text-center"
                            >
                              {day.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recurring-start">Hora de inicio</Label>
                        <Input
                          id="recurring-start"
                          type="time"
                          value={recurringData.startTime}
                          onChange={(e) => setRecurringData(prev => ({
                            ...prev,
                            startTime: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recurring-end">Hora de fin</Label>
                        <Input
                          id="recurring-end"
                          type="time"
                          value={recurringData.endTime}
                          onChange={(e) => setRecurringData(prev => ({
                            ...prev,
                            endTime: e.target.value
                          }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recurring-capacity">Capacidad máxima</Label>
                      <Select
                        value={recurringData.capacity.toString()}
                        onValueChange={(value) => setRecurringData(prev => ({
                          ...prev,
                          capacity: parseInt(value)
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 5, 6, 7, 8].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} personas
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specific_date" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Horario de Día Específico</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="specific-date">Fecha específica</Label>
                      <Input
                        id="specific-date"
                        type="date"
                        value={specificData.specificDate}
                        onChange={(e) => setSpecificData(prev => ({
                          ...prev,
                          specificDate: e.target.value
                        }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specific-start">Hora de inicio</Label>
                        <Input
                          id="specific-start"
                          type="time"
                          value={specificData.startTime}
                          onChange={(e) => setSpecificData(prev => ({
                            ...prev,
                            startTime: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specific-end">Hora de fin</Label>
                        <Input
                          id="specific-end"
                          type="time"
                          value={specificData.endTime}
                          onChange={(e) => setSpecificData(prev => ({
                            ...prev,
                            endTime: e.target.value
                          }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specific-capacity">Capacidad máxima</Label>
                      <Select
                        value={specificData.capacity.toString()}
                        onValueChange={(value) => setSpecificData(prev => ({
                          ...prev,
                          capacity: parseInt(value)
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 5, 6, 7, 8].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} personas
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Simplified form for editing existing slots */}
          {editingSlot && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Editando {editingSlot.slot_type === 'recurring' ? 'Horario Recurrente' : 'Horario Específico'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">Capacidad máxima</Label>
                  <Select
                    value={(scheduleType === 'recurring' ? recurringData.capacity : specificData.capacity).toString()}
                    onValueChange={(value) => {
                      const newCapacity = parseInt(value)
                      if (scheduleType === 'recurring') {
                        setRecurringData(prev => ({ ...prev, capacity: newCapacity }))
                      } else {
                        setSpecificData(prev => ({ ...prev, capacity: newCapacity }))
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 7, 8].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} personas
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Guardando...
                </>
              ) : (
                editingSlot ? 'Actualizar Horario' : 'Crear Horario'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}