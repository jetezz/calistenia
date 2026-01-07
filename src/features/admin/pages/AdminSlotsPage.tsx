import { useState } from 'react'
import { Plus, Edit2, Trash2, Clock, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLoadingState } from '@/components/common'
import { useTimeSlots } from '../hooks'
import { TimeSlotDialog } from '../components/TimeSlotDialog'
import type { Database } from '@/types/database'

type TimeSlot = Database['public']['Tables']['time_slots']['Row']

const DAYS_OF_WEEK = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
]

export function AdminSlotsPage() {
  const {
    timeSlots,
    isLoading,
    refreshTimeSlots,
    deleteTimeSlot,
    toggleTimeSlotActive: toggleSlotStatus
  } = useTimeSlots()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)

  // Convert database day_of_week (0=Sunday) to display index (0=Monday)
  const convertDayOfWeekToDisplayIndex = (dbDayOfWeek: number) => {
    return dbDayOfWeek === 0 ? 6 : dbDayOfWeek - 1
  }

  const handleEdit = (slot: TimeSlot) => {
    setEditingSlot(slot)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingSlot(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      await deleteTimeSlot(id)
    }
  }

  const handleToggleStatus = async (slot: TimeSlot) => {
    await toggleSlotStatus(slot.id, !slot.is_active)
  }

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const groupedSlots = timeSlots.reduce((acc, slot) => {
    const displayIndex = convertDayOfWeekToDisplayIndex(slot.day_of_week)
    if (!acc[displayIndex]) {
      acc[displayIndex] = []
    }
    acc[displayIndex].push(slot)
    return acc
  }, {} as Record<number, TimeSlot[]>)

  if (isLoading) {
    return <PageLoadingState message="Cargando horarios..." />
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Horarios</h1>
          <p className="text-muted-foreground">
            Administra las franjas horarias disponibles para reservas
          </p>
        </div>
        <Button onClick={handleCreate} className="shrink-0">
          <Plus className="size-4 mr-2" />
          Nuevo Horario
        </Button>
      </div>

      {timeSlots.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay horarios configurados</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer horario para permitir que los usuarios reserven clases
            </p>
            <Button onClick={handleCreate}>
              <Plus className="size-4 mr-2" />
              Crear Primer Horario
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {DAYS_OF_WEEK.map((dayName, dayIndex) => {
            const daySlots = groupedSlots[dayIndex] || []
            
            if (daySlots.length === 0) return null

            return (
              <Card key={dayIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-5" />
                    {dayName}
                    <Badge variant="secondary">
                      {daySlots.length} horario{daySlots.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {daySlots
                      .sort((a, b) => a.start_time.localeCompare(b.start_time))
                      .map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-4 rounded-lg border ${
                            slot.is_active 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium text-lg">
                                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="size-4" />
                                <span>Máximo {slot.capacity} personas</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant={slot.is_active ? "default" : "outline"}
                                onClick={() => handleToggleStatus(slot)}
                                className="text-xs px-2 h-6"
                              >
                                {slot.is_active ? 'Activo' : 'Inactivo'}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant={slot.is_active ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {slot.is_active ? 'Activo' : 'Inactivo'}
                            </Badge>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(slot)}
                              >
                                <Edit2 className="size-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(slot.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <TimeSlotDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => {
          setIsDialogOpen(false)
          setEditingSlot(null)
          refreshTimeSlots()
        }}
        editingSlot={editingSlot}
      />
    </div>
  )
}
