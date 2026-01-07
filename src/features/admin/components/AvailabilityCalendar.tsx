import { useState, useEffect, useCallback, useMemo } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTimeSlot } from '@/hooks'
import type { Database } from '@/types/database'

type TimeSlot = Database['public']['Tables']['time_slots']['Row']

interface AvailabilityCalendarProps {
  onDateClick?: (date: string, slots: TimeSlot[]) => void
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function AvailabilityCalendar({ onDateClick }: AvailabilityCalendarProps) {
  const { getAvailableDatesInRange } = useTimeSlot()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarData, setCalendarData] = useState<{
    recurringSlots: TimeSlot[]
    specificSlots: TimeSlot[]
  }>({
    recurringSlots: [],
    specificSlots: []
  })
  const [loading, setLoading] = useState(true)

  const { startDate, endDate, year, month } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Get first and last day of the month
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    // Get first day of the calendar (might be from previous month)
    // Adjust for Monday-first week: getDay() returns 0=Sunday, we want Monday=0
    const startDate = new Date(firstDayOfMonth)
    const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7 // Convert to Monday=0
    startDate.setDate(startDate.getDate() - firstDayWeekday)
    
    // Get last day of the calendar (might be from next month)  
    const endDate = new Date(lastDayOfMonth)
    const lastDayWeekday = (lastDayOfMonth.getDay() + 6) % 7 // Convert to Monday=0
    endDate.setDate(endDate.getDate() + (6 - lastDayWeekday))
    
    return { startDate, endDate, year, month }
  }, [currentDate])

  const loadCalendarData = useCallback(async () => {
    setLoading(true)
    try {
      const fromDate = formatDateToLocalString(startDate)
      const toDate = formatDateToLocalString(endDate)
      
      const data = await getAvailableDatesInRange(fromDate, toDate)
      setCalendarData(data)
    } catch (error) {
      console.error('Error loading calendar data:', error)
    } finally {
      setLoading(false)
    }
  }, [getAvailableDatesInRange, startDate, endDate])

  useEffect(() => {
    loadCalendarData()
  }, [loadCalendarData])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const generateCalendarDays = useCallback(() => {
    const days = []
    const currentCalendarDate = new Date(startDate)
    
    while (currentCalendarDate <= endDate) {
      days.push(new Date(currentCalendarDate))
      currentCalendarDate.setDate(currentCalendarDate.getDate() + 1)
    }
    
    return days
  }, [startDate, endDate])

  const getSlotsForDate = (date: Date) => {
    const dateStr = formatDateToLocalString(date)
    const dayOfWeek = date.getDay()
    
    const recurringForDay = calendarData.recurringSlots.filter(
      slot => slot.day_of_week === dayOfWeek && slot.is_active
    )
    
    const specificForDay = calendarData.specificSlots.filter(
      slot => slot.specific_date === dateStr && slot.is_active
    )
    
    return [...recurringForDay, ...specificForDay]
  }

  const getDayVariant = (date: Date) => {
    const slots = getSlotsForDate(date)
    const isCurrentMonth = date.getMonth() === month
    const isToday = date.toDateString() === new Date().toDateString()
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
    const hasSlots = slots.length > 0
    
    if (isPast) return 'past'
    if (isToday && hasSlots) return 'today-available'
    if (isToday) return 'today'
    if (hasSlots) return 'available'
    if (!isCurrentMonth) return 'other-month'
    return 'unavailable'
  }

  const getDayClasses = (variant: string) => {
    const base = 'min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 flex flex-col cursor-pointer transition-colors'
    
    switch (variant) {
      case 'past':
        return `${base} bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200`
      case 'today':
        return `${base} bg-blue-50 hover:bg-blue-100 border-2 border-blue-500`
      case 'today-available':
        return `${base} bg-green-50 hover:bg-green-100 border-2 border-blue-500`
      case 'other-month':
        return `${base} bg-gray-50 text-gray-400 border border-gray-200`
      case 'available':
        return `${base} bg-green-50 hover:bg-green-100 border border-green-300`
      case 'unavailable':
        return `${base} hover:bg-gray-50 border border-gray-200`
      default:
        return `${base} border border-gray-200`
    }
  }

  const handleDateClick = (date: Date) => {
    const variant = getDayVariant(date)
    if (variant === 'past') return
    
    const slots = getSlotsForDate(date)
    if (onDateClick) {
      onDateClick(formatDateToLocalString(date), slots)
    }
  }

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const calendarDays = useMemo(() => generateCalendarDays(), [generateCalendarDays])

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon className="size-4 sm:size-5" />
          <span className="text-base sm:text-lg font-semibold">Calendario de Disponibilidad</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="font-semibold text-base min-w-[140px] text-center">
            {MONTHS[month]} {year}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pt-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Cargando calendario...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
              {DAYS_OF_WEEK.map(day => (
                <div 
                  key={day}
                  className="p-1.5 sm:p-3 bg-gray-100 text-center font-medium text-xs border-b border-gray-200"
                >
                  {day}
                </div>
              ))}
              
              {calendarDays.map((date, index) => {
                const variant = getDayVariant(date)
                const slots = getSlotsForDate(date)
                const hasRecurring = slots.some(s => s.slot_type === 'recurring')
                const hasSpecific = slots.some(s => s.slot_type === 'specific_date')
                
                return (
                  <div
                    key={index}
                    className={getDayClasses(variant)}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs sm:text-sm font-semibold ${
                        variant === 'today' || variant === 'today-available' ? 'text-blue-600' : 
                        variant === 'available' ? 'text-green-600' : 
                        ''
                      }`}>
                        {date.getDate()}
                      </span>
                      <div className="flex gap-0.5">
                        {hasSpecific && (
                          <Badge variant="outline" className="text-[9px] px-0.5 py-0 leading-tight border-purple-300 text-purple-700 bg-purple-50">
                            E
                          </Badge>
                        )}
                        {hasRecurring && (
                          <Badge variant="outline" className="text-[9px] px-0.5 py-0 leading-tight border-blue-300 text-blue-700 bg-blue-50">
                            S
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-0.5">
                      {slots.slice(0, 2).map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className={`text-[9px] sm:text-[10px] px-1 py-0.5 rounded flex items-center justify-center gap-0.5 font-medium ${
                            slot.slot_type === 'specific_date' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          <Clock className="size-2 shrink-0" />
                          <span className="leading-none">
                            {formatTime(slot.start_time)}
                          </span>
                        </div>
                      ))}
                      {slots.length > 2 && (
                        <div className="text-[9px] text-muted-foreground text-center font-medium">
                          +{slots.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-green-50 border border-green-300 rounded" />
                  <span>Disponibles</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-blue-50 border border-blue-300 rounded" />
                  <span>Hoy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded" />
                  <span>Sin horarios</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 pt-1 border-t">
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] px-0.5 py-0 border-blue-300 text-blue-700 bg-blue-50">
                    S
                  </Badge>
                  <span>Semanal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] px-0.5 py-0 border-purple-300 text-purple-700 bg-purple-50">
                    E
                  </Badge>
                  <span>Específico</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
