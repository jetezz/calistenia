import { useState, useEffect, useMemo } from 'react'
import { Calendar, Clock, Users, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLoadingState } from '@/components/common'
import { useBooking } from '../hooks'
import { useProfile } from '@/features/auth'
import { useUserBookings } from '../hooks/useUserBookings'



const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getWeekDates = (startDate: Date) => {
  const dates = []
  const current = new Date(startDate)
  
  // Find the start of the week (Monday)
  const dayOfWeek = current.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  current.setDate(current.getDate() + mondayOffset)
  
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export function BookingPage() {
  const { profile } = useProfile()
  const { timeSlots, isLoading, isBooking, createBooking, fetchAvailability, getAvailability } = useBooking()
  const { bookings, refreshBookings } = useUserBookings()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewWeek, setViewWeek] = useState<Date>(new Date())

  const formatDate = (date: Date) => {
    return formatDateToLocalString(date)
  }

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const weekDates = useMemo(() => getWeekDates(viewWeek), [viewWeek])
  
  const goToPreviousWeek = () => {
    const newWeek = new Date(viewWeek)
    newWeek.setDate(newWeek.getDate() - 7)
    setViewWeek(newWeek)
  }

  const goToNextWeek = () => {
    const newWeek = new Date(viewWeek)
    newWeek.setDate(newWeek.getDate() + 7)
    setViewWeek(newWeek)
  }

  const goToToday = () => {
    const today = new Date()
    setViewWeek(today)
    setSelectedDate(today)
  }

  const handleBooking = async (timeSlotId: string, bookingDate: string) => {
    const booking = await createBooking(timeSlotId, bookingDate)
    if (booking) {
      await fetchAvailability(timeSlotId, bookingDate)
      await refreshBookings()
    }
  }

  const getSlotsForDay = (dayOfWeek: number) => {
    return timeSlots.filter(slot => slot.day_of_week === dayOfWeek)
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return formatDate(date) === formatDate(today)
  }

  const isSelectedDate = (date: Date) => {
    return formatDate(date) === formatDate(selectedDate)
  }

  const hasAvailableSlots = (date: Date) => {
    const dayOfWeek = date.getDay()
    const slots = getSlotsForDay(dayOfWeek)
    
    return slots.some(slot => {
      const availability = getAvailability(slot.id, formatDate(date))
      return availability && availability.available > 0
    })
  }

  const hasBookingOnDate = (date: Date) => {
    const dateStr = formatDate(date)
    return bookings.some(booking => 
      booking.booking_date === dateStr && 
      booking.status === 'confirmed'
    )
  }

  const isSlotBooked = (timeSlotId: string, date: Date) => {
    const dateStr = formatDate(date)
    return bookings.some(booking => 
      booking.time_slot_id === timeSlotId && 
      booking.booking_date === dateStr && 
      booking.status === 'confirmed'
    )
  }

  // Load availability for visible time slots when dates change
  useEffect(() => {
    const loadAvailability = async () => {
      for (const date of weekDates) {
        const dayOfWeek = date.getDay()
        const slots = getSlotsForDay(dayOfWeek)
        
        for (const slot of slots) {
          await fetchAvailability(slot.id, formatDate(date))
        }
      }
    }

    if (timeSlots.length > 0) {
      loadAvailability()
    }
  }, [weekDates, timeSlots])

  if (isLoading) {
    return <PageLoadingState message="Cargando horarios disponibles..." />
  }

  if (timeSlots.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarDays className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay horarios disponibles</h3>
            <p className="text-muted-foreground">
              Los horarios aparecerán aquí cuando estén configurados
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reservar Clase</h1>
          <p className="text-muted-foreground">
            Tienes {profile?.credits ?? 0} créditos disponibles
          </p>
        </div>
        <Button onClick={goToToday} variant="outline">
          <Calendar className="size-4 mr-2" />
          Ir a hoy
        </Button>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button onClick={goToPreviousWeek} variant="ghost" size="sm">
              <ChevronLeft className="size-4" />
            </Button>
            <CardTitle className="text-center">
              {weekDates[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <Button onClick={goToNextWeek} variant="ghost" size="sm">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const hasSlots = hasAvailableSlots(date)
              const isTodayDate = isToday(date)
              const isBooked = hasBookingOnDate(date)
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  disabled={isPastDate(date)}
                  className={`p-3 text-center rounded-lg border transition-colors relative ${
                    isPastDate(date)
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : isSelectedDate(date)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : isBooked
                      ? 'border-blue-500 border-2 bg-blue-50'
                      : isTodayDate
                      ? 'border-primary border-2 bg-primary/5'
                      : 'hover:bg-muted border-border'
                  }`}
                >
                  <div className={`text-xs ${
                    isBooked && !isSelectedDate(date) ? 'text-blue-600 font-medium' :
                    isTodayDate && !isSelectedDate(date) ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>
                    {DAYS_SHORT[date.getDay()]}
                  </div>
                  <div className="text-lg font-medium">
                    {date.getDate()}
                  </div>
                  {isTodayDate && !isSelectedDate(date) && !isBooked && (
                    <div className="absolute top-1 right-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                  )}
                  {isBooked && !isSelectedDate(date) && (
                    <div className="absolute top-1 right-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                  )}
                  {hasSlots && !isPastDate(date) && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        isSelectedDate(date) ? 'bg-primary-foreground' : 'bg-green-500'
                      }`} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Slots for Selected Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Horarios para {selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const dayOfWeek = selectedDate.getDay()
            const daySlots = getSlotsForDay(dayOfWeek)
            
            if (daySlots.length === 0) {
              return (
                <div className="text-center py-8">
                  <Clock className="size-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No hay horarios disponibles para este día
                  </p>
                </div>
              )
            }

            return (
              <div className="grid gap-4 sm:grid-cols-2">
                {daySlots
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((slot) => {
                    const availability = getAvailability(slot.id, formatDate(selectedDate))
                    const isAvailable = availability && availability.available > 0
                    const slotBooked = isSlotBooked(slot.id, selectedDate)
                    const canBook = !isPastDate(selectedDate) && 
                                  isAvailable && 
                                  (profile?.credits ?? 0) > 0 && 
                                  !isBooking &&
                                  !slotBooked

                    return (
                      <div
                        key={slot.id}
                        className={`p-4 rounded-lg border ${
                          slotBooked
                            ? 'border-blue-200 bg-blue-50'
                            : isAvailable 
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
                              {availability ? (
                                <span>
                                  {availability.available} de {availability.capacity} plazas
                                </span>
                              ) : (
                                <span>Cargando...</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={slotBooked ? 'default' : isAvailable ? 'default' : 'secondary'}
                              className={slotBooked ? 'bg-blue-500 text-white' : isAvailable ? 'bg-green-500 text-white' : ''}
                            >
                              {slotBooked ? 'Reservado' : availability && availability.available > 0 ? 'Disponible' : 'Completo'}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          disabled={!canBook}
                          onClick={() => handleBooking(slot.id, formatDate(selectedDate))}
                        >
                          {slotBooked
                            ? 'Ya tienes reserva'
                            : (profile?.credits ?? 0) <= 0 
                            ? 'Sin créditos' 
                            : isBooking 
                              ? 'Reservando...' 
                              : 'Reservar (1 crédito)'}
                        </Button>
                      </div>
                    )
                  })}
              </div>
            )
          })()}
        </CardContent>
      </Card>
    </div>
  )
}
