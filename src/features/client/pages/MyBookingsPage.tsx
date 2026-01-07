import { Calendar, Clock, X, RefreshCw, CalendarCheck, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageLoadingState } from '@/components/common'
import { useUserBookings } from '../hooks'

export function MyBookingsPage() {
  const {
    upcomingBookings,
    pastBookings,
    isLoading,
    cancelBooking,
    canCancelBooking,
    refreshBookings
  } = useUserBookings()

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
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Reservas</h1>
          <p className="text-muted-foreground">
            Gestiona tus clases reservadas
          </p>
        </div>
        <Button onClick={refreshBookings} variant="outline">
          <RefreshCw className="size-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <CalendarCheck className="size-4" />
            Próximas ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Calendar className="size-4" />
            Historial ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarCheck className="size-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tienes reservas próximas</h3>
                <p className="text-muted-foreground mb-4">
                  ¡Reserva tu próxima clase ahora!
                </p>
                <Button asChild>
                  <a href="/book">
                    <Calendar className="size-4 mr-2" />
                    Reservar clase
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <Calendar className="size-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">
                            {formatDate(booking.booking_date)}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="size-4" />
                            <span>
                              {formatTime(booking.time_slot.start_time)} - {formatTime(booking.time_slot.end_time)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Reservada el {formatDate(booking.created_at)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {getStatusBadge(booking.status)}
                        
                        {canCancelBooking(booking) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(booking.id)}
                            disabled={isLoading}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="size-4 mr-1" />
                            {isLoading ? 'Procesando...' : 'Cancelar'}
                          </Button>
                        )}
                        
                        {!canCancelBooking(booking) && booking.status === 'confirmed' && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertCircle className="size-4" />
                            <span>No se puede cancelar</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="size-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No tienes historial de reservas</h3>
                <p className="text-muted-foreground">
                  Las clases completadas y canceladas aparecerán aquí
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          booking.status === 'completed' ? 'bg-blue-100' :
                          booking.status === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          <Calendar className={`size-6 ${
                            booking.status === 'completed' ? 'text-blue-600' :
                            booking.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">
                            {formatDate(booking.booking_date)}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="size-4" />
                            <span>
                              {formatTime(booking.time_slot.start_time)} - {formatTime(booking.time_slot.end_time)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Reservada el {formatDate(booking.created_at)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {(upcomingBookings.length > 0 || pastBookings.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información sobre cancelaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Solo puedes cancelar reservas con al menos 2 horas de antelación</p>
              <p>• Las cancelaciones no devuelven créditos automáticamente</p>
              <p>• Para solicitar devolución de créditos, contacta con el centro</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
