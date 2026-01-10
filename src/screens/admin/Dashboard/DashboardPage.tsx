import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  CreditCard,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Wallet,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoadingState } from "@/components/common";
import { useDashboardLogic } from "@/hooks/admin/Dashboard/useDashboardLogic";

export function DashboardPage() {
  const { stats, newBookingsCount, isLoading, refresh, markAsSeen } =
    useDashboardLogic();

  if (isLoading) {
    return <PageLoadingState message="Cargando panel de administración..." />;
  }

  const statsCards = [
    {
      title: "Clases de Hoy",
      value: stats.todayBookingsCount,
      description: "Reservas confirmadas",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/app/admin/bookings",
    },
    {
      title: "Solicitudes Pendientes",
      value: stats.pendingPaymentRequestsCount,
      description: "Recargas por aprobar",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/app/admin/payment-requests",
    },
    {
      title: "Usuarios Totales",
      value: stats.totalUsersCount,
      description: "Clientes registrados",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/app/admin/users",
    },
    {
      title: "Horarios Activos",
      value: stats.activeTimeSlotsCount,
      description: "Franjas disponibles",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/app/admin/slots",
    },
  ];

  const quickActions = [
    {
      title: "Gestionar Horarios",
      description: "Crear y editar franjas horarias",
      href: "/app/admin/slots",
      icon: Clock,
    },
    {
      title: "Ver Usuarios",
      description: "Lista de todos los clientes",
      href: "/app/admin/users",
      icon: Users,
    },
    {
      title: "Gestionar Precios",
      description: "Configurar paquetes de clases",
      href: "/app/admin/pricing",
      icon: DollarSign,
    },
    {
      title: "Métodos de Pago",
      description: "Configurar formas de pago",
      href: "/app/admin/payment-methods",
      icon: Wallet,
    },
    {
      title: "Configuración",
      description: "Políticas de cancelación",
      href: "/app/admin/settings",
      icon: Settings,
    },
    {
      title: "Solicitudes de Pago",
      description: "Aprobar recargas de bonos",
      href: "/app/admin/payment-requests",
      icon: CreditCard,
    },
    {
      title: "Todas las Reservas",
      description: "Historial completo",
      href: "/app/admin/bookings",
      icon: Calendar,
    },
  ];

  return (
    <div className="container mx-auto px-3 py-4 pb-20 space-y-6 max-w-4xl">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <Button onClick={refresh} variant="outline" size="sm">
            <TrendingUp className="size-4 mr-2" />
            Actualizar
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Gestiona tu centro de calistenia desde aquí (Nueva Arquitectura)
        </p>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.href} className="block">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 active:scale-[0.98]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`size-6 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold leading-none mb-1">
                        {stat.value}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-3 md:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="size-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription className="text-xs">
              Accede a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  to={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="p-2 rounded-lg bg-muted shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {action.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="size-5" />
              Alertas del Sistema
            </CardTitle>
            <CardDescription>Notificaciones importantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {newBookingsCount > 0 && (
              <Link
                to="/app/admin/bookings"
                onClick={markAsSeen}
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Calendar className="size-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {newBookingsCount} nueva{newBookingsCount > 1 ? "s" : ""}{" "}
                    reserva{newBookingsCount > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click para ver las reservas
                  </p>
                </div>
                <Badge variant="secondary">{newBookingsCount}</Badge>
              </Link>
            )}

            {stats.pendingPaymentRequestsCount > 0 && (
              <Link
                to="/app/admin/payment-requests"
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
              >
                <CreditCard className="size-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {stats.pendingPaymentRequestsCount} solicitudes de pago
                    pendientes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Revisa las recargas de bonos
                  </p>
                </div>
                <Badge variant="secondary">
                  {stats.pendingPaymentRequestsCount}
                </Badge>
              </Link>
            )}

            {newBookingsCount === 0 && stats.todayBookingsCount === 0 && (
              <Link
                to="/app/admin/bookings"
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

            {stats.activeTimeSlotsCount === 0 && (
              <Link
                to="/app/admin/slots"
                className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Clock className="size-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium">No hay horarios activos</p>
                  <p className="text-xs text-muted-foreground">
                    Crea franjas horarias para permitir reservas
                  </p>
                </div>
              </Link>
            )}

            {stats.pendingPaymentRequestsCount === 0 &&
              stats.todayBookingsCount > 0 &&
              stats.activeTimeSlotsCount > 0 && (
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
  );
}
