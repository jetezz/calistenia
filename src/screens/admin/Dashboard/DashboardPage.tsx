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
  ChevronRight,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StandardPage } from "@/components/common";
import { useDashboardLogic } from "@/hooks/admin/Dashboard/useDashboardLogic";

export function DashboardPage() {
  const { stats, newBookingsCount, isLoading, refresh, markAsSeen } =
    useDashboardLogic();

  const statsCards = [
    {
      title: "Hoy",
      value: stats.todayBookingsCount,
      description: "Reservas",
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      href: "/app/admin/bookings",
      highlight: newBookingsCount > 0,
    },
    {
      title: "Pendientes",
      value: stats.pendingPaymentRequestsCount,
      description: "Recargas",
      icon: AlertCircle,
      gradient: "from-orange-500 to-amber-500",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
      href: "/app/admin/payment-requests",
      highlight: stats.pendingPaymentRequestsCount > 0,
    },
    {
      title: "Usuarios",
      value: stats.totalUsersCount,
      description: "Clientes",
      icon: Users,
      gradient: "from-green-500 to-emerald-500",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
      href: "/app/admin/users",
      highlight: stats.pendingUsersCount > 0,
    },
    {
      title: "Horarios",
      value: stats.activeTimeSlotsCount,
      description: "Activos",
      icon: Clock,
      gradient: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      href: "/app/admin/slots",
    },
  ];

  const quickActions = [
    {
      title: "Horarios",
      description: "Gestionar franjas",
      href: "/app/admin/slots",
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Usuarios",
      description: "Ver clientes",
      href: "/app/admin/users",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Precios",
      description: "Paquetes",
      href: "/app/admin/pricing",
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pagos",
      description: "Métodos",
      href: "/app/admin/payment-methods",
      icon: Wallet,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      title: "Config",
      description: "Ajustes",
      href: "/app/admin/settings",
      icon: Settings,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
    {
      title: "Reservas",
      description: "Historial",
      href: "/app/admin/bookings",
      icon: Calendar,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  const alerts = [];

  if (newBookingsCount > 0) {
    alerts.push({
      type: "new-bookings",
      title: `${newBookingsCount} nueva${
        newBookingsCount > 1 ? "s" : ""
      } reserva${newBookingsCount > 1 ? "s" : ""}`,
      description: "Toca para revisar",
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      href: "/app/admin/bookings",
      badge: newBookingsCount,
      onClick: markAsSeen,
    });
  }

  if (stats.pendingUsersCount > 0) {
    alerts.push({
      type: "pending-users",
      title: `${stats.pendingUsersCount} usuario${
        stats.pendingUsersCount > 1 ? "s" : ""
      } pendiente${stats.pendingUsersCount > 1 ? "s" : ""}`,
      description: "Requieren validación",
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      href: "/app/admin/users",
      badge: stats.pendingUsersCount,
    });
  }

  if (stats.pendingPaymentRequestsCount > 0) {
    alerts.push({
      type: "pending-payments",
      title: `${stats.pendingPaymentRequestsCount} solicitud${
        stats.pendingPaymentRequestsCount > 1 ? "es" : ""
      } pendiente${stats.pendingPaymentRequestsCount > 1 ? "s" : ""}`,
      description: "Recargas por aprobar",
      icon: CreditCard,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      href: "/app/admin/payment-requests",
      badge: stats.pendingPaymentRequestsCount,
    });
  }

  if (stats.activeTimeSlotsCount === 0) {
    alerts.push({
      type: "no-slots",
      title: "Sin horarios activos",
      description: "Crea franjas para reservas",
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      href: "/app/admin/slots",
    });
  }

  return (
    <StandardPage
      icon={Sparkles}
      title="Panel Admin"
      onRefresh={refresh}
      isLoading={isLoading}
      loadingMessage="Cargando panel de administración..."
      maxWidth="max-w-4xl"
    >
      {/* Compact Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.href}>
              <Card
                className={`
                relative overflow-hidden transition-all duration-300 
                hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                ${
                  stat.highlight
                    ? "ring-2 ring-primary/50 shadow-md"
                    : "hover:shadow-md"
                }
              `}
              >
                {stat.highlight && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
                )}
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`p-2 rounded-lg ${stat.iconBg} transition-transform duration-300 hover:scale-110`}
                    >
                      <Icon className={`size-4 ${stat.iconColor}`} />
                    </div>
                    {stat.highlight && (
                      <Badge
                        variant="default"
                        className="h-5 px-1.5 text-xs animate-pulse"
                      >
                        Nuevo
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div
                      className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      {stat.description}
                    </div>
                    <div className="text-[10px] text-muted-foreground/70">
                      {stat.title}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Alerts Section - Only show if there are alerts */}
      {alerts.length > 0 && (
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="size-4 text-orange-600" />
              Atención Requerida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <Link
                  key={alert.type}
                  to={alert.href}
                  onClick={alert.onClick}
                  className={`
                    flex items-center gap-2.5 p-2.5 rounded-lg border transition-all
                    ${alert.bg} ${alert.border} hover:shadow-sm active:scale-[0.98]
                  `}
                >
                  <div className="shrink-0">
                    <div className={`p-1.5 rounded-md ${alert.bg}`}>
                      <Icon className={`size-4 ${alert.color}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {alert.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {alert.description}
                    </p>
                  </div>
                  {alert.badge && (
                    <Badge
                      variant="secondary"
                      className="h-5 min-w-5 px-1.5 text-xs"
                    >
                      {alert.badge}
                    </Badge>
                  )}
                  <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Grid */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Acciones Rápidas
          </CardTitle>
          <CardDescription className="text-xs">
            Acceso directo a funciones principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  to={action.href}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-card hover:bg-accent transition-all hover:shadow-sm active:scale-95"
                >
                  <div
                    className={`p-2.5 rounded-lg ${action.bg} transition-transform hover:scale-110`}
                  >
                    <Icon className={`size-4 ${action.color}`} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-gray-900 leading-tight">
                      {action.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      {action.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Success State - Only show when everything is good */}
      {alerts.length === 0 && stats.todayBookingsCount > 0 && (
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-green-500/10">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-900">
                  Todo en orden
                </p>
                <p className="text-xs text-green-700/70">
                  Sistema operativo sin alertas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </StandardPage>
  );
}
