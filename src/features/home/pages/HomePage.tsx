import { Link, Navigate } from 'react-router-dom'
import { CalendarDays, CreditCard, Info, Clock, AlertCircle, Calendar } from 'lucide-react'
import { useProfile } from '@/features/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageLoadingState } from '@/components/common'
import { useClientDashboard } from '@/features/client/hooks'

export function HomePage() {
  const { profile, isAdmin, isLoading } = useProfile()
  const { upcomingBookings, recentPaymentRequest, isLoading: dashboardLoading } = useClientDashboard()

  if (isAdmin && !isLoading) {
    return <Navigate to="/admin" replace />
  }

  const getPaymentStatusBadge = () => {
    switch (profile?.payment_status) {
      case 'paid':
        return <Badge className="bg-green-500 text-white">Al día</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pendiente de pago</Badge>
      case 'unpaid':
        return <Badge variant="destructive">No pagado</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  if (isLoading || dashboardLoading) {
    return <PageLoadingState message="Cargando tu perfil..." />
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          ¡Hola, {profile?.full_name?.split(' ')[0] || 'deportista'}!
        </h1>
        <p className="text-muted-foreground">Bienvenido a Calistenia Emérita</p>
      </div>

      {/* Credits and Payment Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Tus Créditos</span>
            {getPaymentStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold text-primary">{profile?.credits ?? 0}</span>
            <span className="text-muted-foreground">clases disponibles</span>
          </div>
          
          {profile?.credits === 0 && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <AlertCircle className="size-5 text-orange-600" />
              <p className="text-sm">
                No tienes créditos disponibles. 
                <Link to="/request-credits" className="ml-1 text-primary hover:underline font-medium">
                  Recarga aquí
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Request Status */}
      {recentPaymentRequest && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Estado de tu Solicitud
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">
                  Solicitud de {recentPaymentRequest.credits_requested} créditos
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(recentPaymentRequest.created_at)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge 
                  variant={recentPaymentRequest.status === 'approved' ? 'default' : 
                          recentPaymentRequest.status === 'pending' ? 'secondary' : 'destructive'}
                  className={recentPaymentRequest.status === 'approved' ? 'bg-green-500 text-white' :
                            recentPaymentRequest.status === 'pending' ? 'bg-yellow-500 text-white' : ''}
                >
                  {recentPaymentRequest.status === 'approved' ? 'Aprobada' :
                   recentPaymentRequest.status === 'pending' ? 'Pendiente' : 'Rechazada'}
                </Badge>
                {recentPaymentRequest.admin_notes && (
                  <p className="text-xs text-muted-foreground italic">
                    "{recentPaymentRequest.admin_notes}"
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              Próximas Clases
            </CardTitle>
            <CardDescription>
              Tus reservas confirmadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div 
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="size-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {formatDate(booking.booking_date)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(booking.time_slot.start_time)} - {formatTime(booking.time_slot.end_time)}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    Confirmada
                  </Badge>
                </div>
              ))}
              {upcomingBookings.length >= 3 && (
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link to="/my-bookings">
                    Ver todas las reservas
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid gap-4">
        <Button asChild size="lg" className="h-14 text-lg">
          <Link to="/book">
            <CalendarDays className="mr-2 size-5" />
            Reservar clase
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="h-14 text-lg">
          <Link to="/request-credits">
            <CreditCard className="mr-2 size-5" />
            Recargar bonos
          </Link>
        </Button>

        {upcomingBookings.length > 0 && (
          <Button asChild variant="ghost" size="lg" className="h-14">
            <Link to="/my-bookings">
              <Calendar className="mr-2 size-5" />
              Mis reservas
            </Link>
          </Button>
        )}

        <Button asChild variant="ghost" size="lg" className="h-14">
          <Link to="/payment-info">
            <Info className="mr-2 size-5" />
            Información de pago
          </Link>
        </Button>
      </div>
    </div>
  )
}
