import { useEffect } from 'react'
import { Calendar, Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageLoadingState } from '@/components/common'
import { useBooking, useToast } from '@/hooks'

type BookingWithTimeSlotAndUser = {
  id: string
  user_id: string
  time_slot_id: string
  booking_date: string
  status: string
  created_at: string
  user: { id: string; full_name: string | null; email: string }
  time_slot: {
    id: string
    day_of_week: number
    start_time: string
    end_time: string
    capacity: number
    created_at: string
    updated_at: string
  }
}


export function AdminBookingsPage() {
  const { success, error: showError } = useToast()
  const { 
    bookings, 
    loading: isLoading, 
    fetchBookings,
    updateBooking: updateStatus
  } = useBooking()

  // Cast to include user relations since service returns joined data
  const typedBookings = bookings as unknown as BookingWithTimeSlotAndUser[]

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await updateStatus(bookingId, { status })
      if (status === 'cancelled') {
        success('Reserva cancelada. Crédito devuelto al usuario')
      } else {
        success(`Reserva actualizada a ${status}`)
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      showError('Error al actualizar la reserva')
    }
  }

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-500 text-white">Confirmada</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const DAYS_OF_WEEK = [
    'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'
  ]

  // Convert database day_of_week (0=Sunday) to display index (0=Monday)
  const convertDayOfWeekToDisplayIndex = (dbDayOfWeek: number) => {
    return dbDayOfWeek === 0 ? 6 : dbDayOfWeek - 1
  }

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  if (isLoading) {
    return <PageLoadingState message="Cargando reservas..." />
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Reservas</h1>
          <p className="text-muted-foreground">
            Administra todas las reservas del sistema
          </p>
        </div>
        <Button onClick={fetchBookings}>
          <Plus className="size-4 mr-2" />
          Actualizar Lista
        </Button>
      </div>

      {typedBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay reservas registradas</h3>
            <p className="text-muted-foreground">
              Las reservas aparecerán aquí cuando los usuarios las realicen
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              Todas las Reservas ({typedBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Creada</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typedBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {booking.user.full_name || 'Sin nombre'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {booking.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatDate(booking.booking_date)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {DAYS_OF_WEEK[convertDayOfWeekToDisplayIndex(booking.time_slot.day_of_week)]}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="size-3" />
                          <span>
                            {formatTime(booking.time_slot.start_time)} - {formatTime(booking.time_slot.end_time)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getBookingStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(booking.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {booking.status === 'confirmed' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                              >
                                Completar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              >
                                Cancelar
                              </Button>
                            </>
                          )}
                          {booking.status === 'cancelled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            >
                              Restaurar
                            </Button>
                          )}
                          {booking.status === 'completed' && (
                            <span className="text-xs text-muted-foreground">
                              Finalizada
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
