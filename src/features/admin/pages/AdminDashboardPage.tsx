import { Link } from 'react-router-dom'
import { Calendar, Users, Clock, CreditCard, AlertCircle, TrendingUp, DollarSign, Wallet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAdminDashboard } from '../hooks'
import { PageLoadingState } from '@/components/common'

export function AdminDashboardPage() {
  const { stats, isLoading, refreshStats } = useAdminDashboard()

  if (isLoading) {
    return <PageLoadingState message="Cargando panel de administración..." />
  }

  const statsCards = [
    {
      title: 'Clases de Hoy',
      value: stats.todayBookings,
      description: 'Reservas confirmadas',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Solicitudes Pendientes',
      value: stats.pendingPaymentRequests,
      description: 'Recargas por aprobar',
      icon: AlertCircle,
      color: 'text-orange-600'
    },
    {
      title: 'Usuarios Totales',
      value: stats.totalUsers,
      description: 'Clientes registrados',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Horarios Activos',
      value: stats.activeTimeSlots,
      description: 'Franjas disponibles',
      icon: Clock,
      color: 'text-purple-600'
    }
  ]

  const quickActions = [
    {
      title: 'Gestionar Horarios',
      description: 'Crear y editar franjas horarias',
      href: '/admin/slots',
      icon: Clock,
      variant: 'default' as const
    },
    {
      title: 'Ver Usuarios',
      description: 'Lista de todos los clientes',
      href: '/admin/users',
      icon: Users,
      variant: 'secondary' as const
    },
    {
      title: 'Gestionar Precios',
      description: 'Configurar paquetes de clases',
      href: '/admin/pricing',
      icon: DollarSign,
      variant: 'secondary' as const
    },
    {
      title: 'Métodos de Pago',
      description: 'Configurar formas de pago',
      href: '/admin/payment-methods',
      icon: Wallet,
      variant: 'secondary' as const
    },
    {
      title: 'Solicitudes de Pago',
      description: 'Aprobar recargas de bonos',
      href: '/admin/payment-requests',
      icon: CreditCard,
      variant: 'outline' as const
    },
    {
      title: 'Todas las Reservas',
      description: 'Historial completo',
      href: '/admin/bookings',
      icon: Calendar,
      variant: 'ghost' as const
    }
  ]

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Button onClick={refreshStats} variant="outline" size="sm">
            <TrendingUp className="size-4 mr-2" />
            Actualizar
          </Button>
        </div>
        <p className="text-muted-foreground">
          Gestiona tu centro de calistenia desde aquí
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Accede a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.href}
                  asChild
                  variant={action.variant}
                  className="justify-start h-auto p-4"
                >
                  <Link to={action.href}>
                    <div className="flex items-start gap-3">
                      <Icon className="size-5 mt-0.5 shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Button>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="size-5" />
              Alertas del Sistema
            </CardTitle>
            <CardDescription>
              Notificaciones importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.pendingPaymentRequests > 0 && (
              <Link 
                to="/admin/payment-requests"
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
              >
                <CreditCard className="size-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {stats.pendingPaymentRequests} solicitudes de pago pendientes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Revisa las recargas de bonos
                  </p>
                </div>
                <Badge variant="secondary">
                  {stats.pendingPaymentRequests}
                </Badge>
              </Link>
            )}
            
            {stats.todayBookings === 0 && (
              <Link
                to="/admin/bookings"
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Calendar className="size-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">
                    No hay clases reservadas para hoy
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Los clientes pueden reservar en cualquier momento
                  </p>
                </div>
              </Link>
            )}

            {stats.activeTimeSlots === 0 && (
              <Link
                to="/admin/slots"
                className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Clock className="size-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium">
                    No hay horarios activos
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Crea franjas horarias para permitir reservas
                  </p>
                </div>
              </Link>
            )}

            {stats.pendingPaymentRequests === 0 && stats.todayBookings > 0 && stats.activeTimeSlots > 0 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <TrendingUp className="size-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">
                    Todo funcionando correctamente
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sistema operativo sin alertas
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
