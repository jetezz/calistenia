import { Calendar, Clock, Plus, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoadingState } from "@/components/common";
import { useAdminBookingsLogic } from "@/hooks/admin/Bookings/useAdminBookingsLogic";

export function BookingsPage() {
  const { bookings, isLoading, handleUpdateStatus, refresh } =
    useAdminBookingsLogic();

  // Helper local para renderizado
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-500 text-white">Confirmada</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>;
      case "completed":
        return <Badge className="bg-green-500 text-white">Completada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const DAYS_OF_WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const convertDayOfWeekToDisplayIndex = (dbDayOfWeek: number) => {
    return dbDayOfWeek === 0 ? 6 : dbDayOfWeek - 1;
  };

  return (
    <div className="container mx-auto px-3 py-4 pb-20 space-y-4 max-w-4xl">
      {isLoading ? (
        <PageLoadingState message="Cargando reservas..." />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-bold">Reservas</h1>
              <Button onClick={() => refresh()} size="sm">
                <Plus className="size-4 mr-1" />
                Actualizar
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Administra todas las reservas del sistema
            </p>
          </div>

          {!bookings || bookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="size-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No hay reservas registradas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Las reservas aparecerán aquí cuando los usuarios las realicen
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1 mb-2">
                <Calendar className="size-4 text-muted-foreground" />
                <h2 className="font-semibold text-base">Todas las Reservas</h2>
                <Badge variant="outline" className="text-xs">
                  {bookings.length}
                </Badge>
              </div>

              <div className="space-y-2">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 rounded-lg border bg-card"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <User className="size-3 text-muted-foreground shrink-0" />
                            <span className="font-semibold text-sm truncate">
                              {booking.user?.full_name || "Sin nombre"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="size-3 shrink-0" />
                            <span className="truncate">
                              {booking.user?.email}
                            </span>
                          </div>
                        </div>
                        {getBookingStatusBadge(booking.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Fecha</div>
                          <div className="font-medium">
                            {formatDate(booking.booking_date)}
                          </div>
                          <div className="text-muted-foreground text-[10px]">
                            {booking.time_slot &&
                              DAYS_OF_WEEK[
                                convertDayOfWeekToDisplayIndex(
                                  booking.time_slot.day_of_week
                                )
                              ]}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Horario</div>
                          <div className="flex items-center gap-1 font-medium">
                            <Clock className="size-3" />
                            <span>
                              {booking.time_slot
                                ? `${formatTime(
                                    booking.time_slot.start_time
                                  )} - ${formatTime(
                                    booking.time_slot.end_time
                                  )}`
                                : "Horario eliminado"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 pt-2 border-t">
                        {booking.status === "confirmed" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateStatus(booking.id, "completed")
                              }
                              className="flex-1 h-8 text-xs"
                            >
                              Completar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleUpdateStatus(booking.id, "cancelled")
                              }
                              className="flex-1 h-8 text-xs"
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                        {booking.status === "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateStatus(booking.id, "confirmed")
                            }
                            className="w-full h-8 text-xs"
                          >
                            Restaurar
                          </Button>
                        )}
                        {booking.status === "completed" && (
                          <div className="w-full text-center text-xs text-muted-foreground py-1">
                            Finalizada
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
