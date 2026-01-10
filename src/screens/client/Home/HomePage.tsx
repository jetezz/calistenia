import { Link, Navigate } from "react-router-dom";
import {
  CalendarDays,
  CreditCard,
  Info,
  Clock,
  AlertCircle,
  Calendar,
  RefreshCw,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/dateUtils";
import { useProfile } from "@/features/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoadingState, StandardPage } from "@/components/common";
import { useHomeLogic } from "@/hooks/client/Home/useHomeLogic";
import { useState } from "react";

export function HomePage() {
  const { profile, isAdmin, isLoading: authLoading } = useProfile();
  const {
    upcomingBookings,
    recentPaymentRequests,
    allPaymentRequests,
    isLoading: dashboardLoading,
    refreshDashboard,
  } = useHomeLogic();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);

  if (isAdmin && !authLoading) {
    return <Navigate to="/app/admin" replace />;
  }

  const getPaymentStatusBadge = () => {
    switch (profile?.payment_status) {
      case "paid":
        return <Badge className="bg-green-500 text-white">Al día</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-500 text-white">Pendiente de pago</Badge>
        );
      case "unpaid":
        return <Badge variant="destructive">No pagado</Badge>;
      default:
        return null;
    }
  };

  if (authLoading || dashboardLoading) {
    return <PageLoadingState message="Cargando tu perfil..." />;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDashboard();
    setIsRefreshing(false);
  };

  return (
    <StandardPage
      icon={LayoutDashboard}
      title={`¡Hola, ${profile?.full_name?.split(" ")[0] || "deportista"}!`}
      description="Bienvenido a Calistenia Emérita"
      onRefresh={handleRefresh}
      maxWidth="max-w-4xl"
    >
      {/* 1. Credits and Payment Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Tus Créditos</span>
            {getPaymentStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold text-primary">
              {profile?.credits ?? 0}
            </span>
            <span className="text-muted-foreground">clases disponibles</span>
          </div>

          {profile?.credits === 0 && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <AlertCircle className="size-5 text-orange-600" />
              <p className="text-sm">
                No tienes créditos disponibles.
                <Link
                  to="/app/request-credits"
                  className="ml-1 text-primary hover:underline font-medium"
                >
                  Recarga aquí
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              Próximas Clases
            </CardTitle>
            <CardDescription>Tus reservas confirmadas</CardDescription>
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
                        {booking.time_slot &&
                          `${formatTime(
                            booking.time_slot.start_time
                          )} - ${formatTime(booking.time_slot.end_time)}`}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white">Confirmada</Badge>
                </div>
              ))}
              {upcomingBookings.length >= 3 && (
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link to="/app/my-bookings">Ver todas las reservas</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. Payment Request Status */}
      {recentPaymentRequests.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Estado de tus Solicitudes
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 w-8"
              >
                <RefreshCw
                  className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(showAllRequests
                ? allPaymentRequests
                : recentPaymentRequests
              ).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <div className="font-medium">
                      Solicitud de {request.credits_requested} créditos
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(request.created_at)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "default"
                          : request.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        request.status === "approved"
                          ? "bg-green-500 text-white"
                          : request.status === "pending"
                          ? "bg-yellow-500 text-white"
                          : ""
                      }
                    >
                      {request.status === "approved"
                        ? "Aprobada"
                        : request.status === "pending"
                        ? "Pendiente"
                        : "Rechazada"}
                    </Badge>
                    {request.admin_notes && (
                      <p className="text-xs text-muted-foreground italic">
                        "{request.admin_notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {!showAllRequests && allPaymentRequests.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAllRequests(true)}
                >
                  <ChevronDown className="size-4 mr-2" />
                  Cargar más ({allPaymentRequests.length - 3} más)
                </Button>
              )}
              {showAllRequests && allPaymentRequests.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAllRequests(false)}
                >
                  Mostrar menos
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid gap-4">
        <Button asChild size="lg" className="h-14 text-lg">
          <Link to="/app/book">
            <CalendarDays className="mr-2 size-5" />
            Reservar clase
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="h-14 text-lg">
          <Link to="/app/request-credits">
            <CreditCard className="mr-2 size-5" />
            Recargar bonos
          </Link>
        </Button>

        {upcomingBookings.length > 0 && (
          <Button asChild variant="ghost" size="lg" className="h-14">
            <Link to="/app/my-bookings">
              <Calendar className="mr-2 size-5" />
              Mis reservas
            </Link>
          </Button>
        )}

        <Button asChild variant="ghost" size="lg" className="h-14">
          <Link to="/app/payment-info">
            <Info className="mr-2 size-5" />
            Información de pago
          </Link>
        </Button>
      </div>
    </StandardPage>
  );
}
