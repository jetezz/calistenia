import { Calendar, Clock, X, RefreshCw, CalendarCheck, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageLoadingState } from '@/components/common'
import { useUserBookings } from '../hooks'
import { useAppSettings } from '@/hooks'

export function MyBookingsPage() {
  const {
    upcomingBookings,
    pastBookings,
    isLoading,
    cancelBooking,
    canCancelBooking,
    refreshBookings
  } = useUserBookings()
  
  const { getCancellationPolicy } = useAppSettings()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmada</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>
      case 'completed':
        return <Badge className="bg-blue-500 text-white">Completada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleCancel = async (bookingId: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      await cancelBooking(bookingId)
    }
  }

  if (isLoading) {
    return <PageLoadingState message="Cargando tus reservas..." />
  }

  return (
    <div className="container mx-auto px-3 py-4 pb-20 space-y-4 max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Mis Reservas</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tus clases
          </p>
        </div>
        <Button onClick={refreshBookings} variant="outline" size="sm">
          <RefreshCw className="size-4" />
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2 text-xs">
            <CalendarCheck className="size-3" />
            Próximas ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2 text-xs">
            <Calendar className="size-3" />
            Historial ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarCheck className="size-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base font-medium mb-2">No tienes reservas próximas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  ¡Reserva tu próxima clase ahora!
                </p>
                <Button asChild size="sm">
                  <a href="/book">
                    <Calendar className="size-4 mr-2" />
                    Reservar clase
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="p-3 rounded-lg border bg-card space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-md flex-shrink-0">
                      <Calendar className="size-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight">
                        {formatDate(booking.booking_date)}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Clock className="size-3" />
                        <span>
                          {formatTime(booking.time_slot.start_time)} - {formatTime(booking.time_slot.end_time)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Reservada el {formatDate(booking.created_at)}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {canCancelBooking(booking) ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(booking.id)}
                        disabled={isLoading}
                        className="w-full h-8 text-xs text-destructive hover:text-destructive"
                      >
                        <X className="size-3 mr-1" />
                        {isLoading ? 'Procesando...' : 'Cancelar reserva'}
                      </Button>
                    ) : booking.status === 'confirmed' ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full justify-center">
                        <AlertCircle className="size-3" />
                        <span>No se puede cancelar</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="size-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base font-medium mb-2">No tienes historial de reservas</h3>
                <p className="text-sm text-muted-foreground">
                  Las clases completadas y canceladas aparecerán aquí
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {pastBookings.map((booking) => (
                <div key={booking.id} className="p-3 rounded-lg border bg-card space-y-2 opacity-75">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md flex-shrink-0 ${
                      booking.status === 'completed' ? 'bg-blue-100' :
                      booking.status === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <Calendar className={`size-4 ${
                        booking.status === 'completed' ? 'text-blue-600' :
                        booking.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight">
                        {formatDate(booking.booking_date)}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Clock className="size-3" />
                        <span>
                          {formatTime(booking.time_slot.start_time)} - {formatTime(booking.time_slot.end_time)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Reservada el {formatDate(booking.created_at)}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {(upcomingBookings.length > 0 || pastBookings.length > 0) && (
        <div className="p-3 rounded-lg border bg-card">
          <h3 className="font-semibold text-sm mb-2">Información sobre cancelaciones</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            {getCancellationPolicy().value === 0 ? (
              <p>• Puedes cancelar tus reservas en cualquier momento</p>
            ) : (
              <p>• Solo puedes cancelar reservas con al menos {getCancellationPolicy().value} {getCancellationPolicy().unit === 'hours' ? (getCancellationPolicy().value === 1 ? 'hora' : 'horas') : (getCancellationPolicy().value === 1 ? 'día' : 'días')} de antelación</p>
            )}
            <p>• Las cancelaciones devuelven el crédito automáticamente</p>
            <p>• Puedes reservar nuevamente usando tus créditos disponibles</p>
          </div>
        </div>
      )}
    </div>
  )
}
