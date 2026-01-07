import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Clock, Users, Calendar, CalendarDays, User, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageLoadingState } from '@/components/common'
import { useTimeSlots } from '../hooks'
import { EnhancedTimeSlotDialog, AddUserToSlotDialog } from '../components'
import { AvailabilityCalendar } from '../components/AvailabilityCalendar'
import { bookingService } from '@/services'
import type { Database } from '@/types/database'

type TimeSlot = Database['public']['Tables']['time_slots']['Row']
type Booking = Database['public']['Tables']['bookings']['Row']

type BookingWithUser = Booking & {
  user: { id: string; full_name: string | null; email: string }
}

const DAYS_OF_WEEK = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
]

export function EnhancedAdminSlotsPage() {
  const {
    timeSlots,
    isLoading,
    refreshTimeSlots,
    deleteTimeSlot,
    toggleTimeSlotActive: toggleSlotStatus
  } = useTimeSlots()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)
  const [selectedDateSlots, setSelectedDateSlots] = useState<{
    date: string
    slots: TimeSlot[]
  } | null>(null)
  const [slotBookings, setSlotBookings] = useState<Record<string, BookingWithUser[]>>({})
  const [addUserDialog, setAddUserDialog] = useState<{
    isOpen: boolean
    slotId: string
    bookingDate: string
    slotTime: string
  }>({
    isOpen: false,
    slotId: '',
    bookingDate: '',
    slotTime: ''
  })

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

  const handleCalendarDateClick = (date: string, slots: TimeSlot[]) => {
    setSelectedDateSlots({ date, slots })
    loadBookingsForSlots(slots, date)
  }

  const loadBookingsForSlots = async (slots: TimeSlot[], date: string) => {
    const bookingsMap: Record<string, BookingWithUser[]> = {}
    
    try {
      const allBookingsForDate = await bookingService.getBookingsByDate(date)
      
      for (const slot of slots) {
        const matchingBookings = allBookingsForDate.filter(booking => {
          const bookingSlot = booking.time_slot
          if (!bookingSlot) return false
          
          return (
            bookingSlot.start_time === slot.start_time &&
            bookingSlot.end_time === slot.end_time
          )
        })
        
        bookingsMap[slot.id] = matchingBookings
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
      slots.forEach(slot => {
        bookingsMap[slot.id] = []
      })
    }
    
    setSlotBookings(bookingsMap)
  }

  useEffect(() => {
    if (selectedDateSlots) {
      loadBookingsForSlots(selectedDateSlots.slots, selectedDateSlots.date)
    }
  }, [timeSlots, selectedDateSlots])

  // Convert database day_of_week (0=Sunday) to display index (0=Monday)
  const convertDayOfWeekToDisplayIndex = (dbDayOfWeek: number) => {
    return dbDayOfWeek === 0 ? 6 : dbDayOfWeek - 1
  }

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Separate recurring and specific date slots
  const recurringSlots = timeSlots.filter(slot => slot.slot_type === 'recurring')
  const specificDateSlots = timeSlots.filter(slot => slot.slot_type === 'specific_date')

  // Group recurring slots by day of week (converted to Monday-first display index)
  const groupedRecurringSlots = recurringSlots.reduce((acc, slot) => {
    const displayIndex = convertDayOfWeekToDisplayIndex(slot.day_of_week)
    if (!acc[displayIndex]) {
      acc[displayIndex] = []
    }
    acc[displayIndex].push(slot)
    return acc
  }, {} as Record<number, TimeSlot[]>)

  // Group specific date slots by date
  const groupedSpecificSlots = specificDateSlots.reduce((acc, slot) => {
    const date = slot.specific_date!
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(slot)
    return acc
  }, {} as Record<string, TimeSlot[]>)

  if (isLoading) {
    return <PageLoadingState message="Cargando horarios..." />
  }

  const TimeSlotCard = ({ slot, showBookings = false }: { slot: TimeSlot; showBookings?: boolean }) => {
    const bookings = showBookings ? slotBookings[slot.id] || [] : []
    const bookedCount = bookings.length

    return (
      <div key={slot.id} className={`p-3 rounded-lg border bg-card ${!slot.is_active ? 'opacity-60' : ''}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground shrink-0" />
              <span className="font-medium text-sm">
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </span>
            </div>
            <Badge variant={slot.is_active ? 'default' : 'secondary'} className="text-xs">
              {slot.is_active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="size-3" />
              <span>{slot.capacity} plazas</span>
            </div>
            {showBookings && (
              <Badge variant={bookedCount >= slot.capacity ? 'destructive' : 'secondary'} className="text-xs">
                {bookedCount}/{slot.capacity}
              </Badge>
            )}
          </div>
        
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleToggleStatus(slot)}
              className="flex-1 h-8 text-xs"
            >
              {slot.is_active ? 'Desactivar' : 'Activar'}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleEdit(slot)}
              className="h-8 w-8 shrink-0"
            >
              <Edit2 className="size-3" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleDelete(slot.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 shrink-0"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        </div>

        {showBookings && (
          <div className="mt-3 pt-3 border-t space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <User className="size-3 text-muted-foreground" />
                <span className="text-xs font-medium">Reservados:</span>
              </div>
              {selectedDateSlots && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddUserDialog({
                    isOpen: true,
                    slotId: slot.id,
                    bookingDate: selectedDateSlots.date,
                    slotTime: `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`
                  })}
                  className="h-7 text-xs"
                >
                  <UserPlus className="size-3 mr-1" />
                  Añadir
                </Button>
              )}
            </div>
            {bookings.length > 0 ? (
              <div className="space-y-1">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-2 text-xs pl-4">
                    <div className="size-1 rounded-full bg-primary shrink-0" />
                    <span className="truncate">{booking.user.full_name || booking.user.email}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground pl-4">
                No hay usuarios reservados
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 py-4  space-y-4 max-w-4xl">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Horarios</h1>
          <Button onClick={handleCreate} size="sm">
            <Plus className="size-4 mr-1" />
            Nuevo
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Administra horarios semanales y días específicos
        </p>
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
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-full">
            <TabsTrigger value="calendar" className="gap-1.5">
              <Calendar className="size-4" />
              <span className="hidden sm:inline">Calendario</span>
            </TabsTrigger>
            <TabsTrigger value="recurring" className="gap-1.5">
              <Clock className="size-4" />
              <span className="hidden sm:inline">Semanales</span>
            </TabsTrigger>
            <TabsTrigger value="specific" className="gap-1.5">
              <CalendarDays className="size-4" />
              <span className="hidden sm:inline">Específicos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <AvailabilityCalendar onDateClick={handleCalendarDateClick} />
            
            {selectedDateSlots && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {formatDate(selectedDateSlots.date)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateSlots.slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay horarios configurados para este día
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDateSlots.slots.map(slot => (
                        <TimeSlotCard key={slot.id} slot={slot} showBookings={true} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recurring" className="space-y-4">
            {Object.keys(groupedRecurringSlots).length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Clock className="size-8 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-medium mb-2">No hay horarios semanales</h3>
                  <p className="text-muted-foreground mb-4">
                    Los horarios semanales se repiten cada semana automáticamente
                  </p>
                  <Button onClick={handleCreate}>
                    <Plus className="size-4 mr-2" />
                    Crear Horario Semanal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((dayName, dayIndex) => {
                  const slotsForDay = groupedRecurringSlots[dayIndex] || []
                  
                  if (slotsForDay.length === 0) return null
                  
                  return (
                    <div key={dayIndex} className="space-y-2">
                      <div className="flex items-center gap-2 px-1">
                        <Calendar className="size-4 text-muted-foreground" />
                        <h3 className="font-semibold text-base">{dayName}</h3>
                        <Badge variant="outline" className="text-xs">
                          {slotsForDay.length}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {slotsForDay.map(slot => (
                          <TimeSlotCard key={slot.id} slot={slot} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="specific" className="space-y-4">
            {Object.keys(groupedSpecificSlots).length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <CalendarDays className="size-8 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-medium mb-2">No hay horarios específicos</h3>
                  <p className="text-muted-foreground mb-4">
                    Los horarios específicos son para fechas concretas y no se repiten
                  </p>
                  <Button onClick={handleCreate}>
                    <Plus className="size-4 mr-2" />
                    Crear Horario Específico
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {Object.entries(groupedSpecificSlots)
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .map(([date, slots]) => (
                    <div key={date} className="space-y-2">
                      <div className="flex items-center gap-2 px-1">
                        <CalendarDays className="size-4 text-muted-foreground" />
                        <h3 className="font-semibold text-base">{formatDate(date)}</h3>
                        <Badge variant="outline" className="text-xs">
                          {slots.length}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {slots.map(slot => (
                          <TimeSlotCard key={slot.id} slot={slot} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <AddUserToSlotDialog
        isOpen={addUserDialog.isOpen}
        onClose={() => setAddUserDialog({ ...addUserDialog, isOpen: false })}
        onSuccess={() => {
          if (selectedDateSlots) {
            loadBookingsForSlots(selectedDateSlots.slots, selectedDateSlots.date)
          }
        }}
        slotId={addUserDialog.slotId}
        bookingDate={addUserDialog.bookingDate}
        slotTime={addUserDialog.slotTime}
      />

      <EnhancedTimeSlotDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingSlot(null)
        }}
        onSuccess={refreshTimeSlots}
        editingSlot={editingSlot}
      />
    </div>
  )
}
