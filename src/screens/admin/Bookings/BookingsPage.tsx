import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StandardPage } from "@/components/common";
import { useAdminBookingsLogic } from "@/hooks/admin/Bookings/useAdminBookingsLogic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Tables } from "@/types/database";

type BookingWithDetails = Tables<"bookings"> & {
  time_slot: Tables<"time_slots"> | null;
  user: { id: string; full_name: string | null; email: string } | null;
};

export function BookingsPage() {
  const { bookings, isLoading, handleUpdateStatus, handleDelete, refresh } =
    useAdminBookingsLogic();

  const [bookingToDelete, setBookingToDelete] =
    useState<BookingWithDetails | null>(null);

  const confirmDelete = async () => {
    if (bookingToDelete) {
      await handleDelete(bookingToDelete.id);
      setBookingToDelete(null);
    }
  };

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
        return (
          <Badge
            variant="outline"
            className="border-green-500 text-green-700 bg-green-50 shrink-0"
          >
            Confirmada
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="border-red-500 text-red-700 bg-red-50 shrink-0"
          >
            Cancelada
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="border-blue-500 text-blue-700 bg-blue-50 shrink-0"
          >
            Completada
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-700 bg-yellow-50 shrink-0"
          >
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="shrink-0">
            {status}
          </Badge>
        );
    }
  };

  const DAYS_OF_WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const convertDayOfWeekToDisplayIndex = (dbDayOfWeek: number) => {
    return dbDayOfWeek === 0 ? 6 : dbDayOfWeek - 1;
  };

  const todayStr = new Date().toLocaleDateString("en-CA");

  return (
    <StandardPage
      icon={Calendar}
      title="Reservas"
      description="Administra todas las reservas del sistema"
      onRefresh={refresh}
      isLoading={isLoading}
      loadingMessage="Cargando reservas..."
      maxWidth="max-w-4xl"
    >
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
        <Accordion
          type="multiple"
          defaultValue={["today"]}
          className="space-y-4"
        >
          {/* Solicitudes Pendientes */}
          {bookings.filter((b) => b.status === "pending").length > 0 && (
            <AccordionItem value="pending" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2 px-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-yellow-600" />
                  <h2 className="font-semibold text-lg text-yellow-700">
                    Solicitudes Pendientes
                  </h2>
                  <Badge className="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200">
                    {bookings.filter((b) => b.status === "pending").length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="space-y-3">
                  {bookings
                    .filter((b) => b.status === "pending")
                    .map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getBookingStatusBadge={getBookingStatusBadge}
                        DAYS_OF_WEEK={DAYS_OF_WEEK}
                        convertDayOfWeekToDisplayIndex={
                          convertDayOfWeekToDisplayIndex
                        }
                        handleUpdateStatus={handleUpdateStatus}
                        onDeleteClick={() => setBookingToDelete(booking)}
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Reservas para hoy */}
          <AccordionItem value="today" className="border-none">
            <AccordionTrigger className="hover:no-underline py-2 px-1">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <h2 className="font-semibold text-lg">Reservas para hoy</h2>
                <Badge variant="secondary" className="text-xs">
                  {
                    bookings.filter(
                      (b) =>
                        b.booking_date === todayStr && b.status !== "pending"
                    ).length
                  }
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="space-y-3">
                {bookings.filter(
                  (b) => b.booking_date === todayStr && b.status !== "pending"
                ).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
                    No hay reservas para hoy
                  </p>
                ) : (
                  bookings
                    .filter(
                      (b) =>
                        b.booking_date === todayStr && b.status !== "pending"
                    )
                    .map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getBookingStatusBadge={getBookingStatusBadge}
                        DAYS_OF_WEEK={DAYS_OF_WEEK}
                        convertDayOfWeekToDisplayIndex={
                          convertDayOfWeekToDisplayIndex
                        }
                        handleUpdateStatus={handleUpdateStatus}
                        onDeleteClick={() => setBookingToDelete(booking)}
                      />
                    ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Reservas completadas */}
          <AccordionItem value="completed" className="border-none">
            <AccordionTrigger className="hover:no-underline py-2 px-1">
              <div className="flex items-center gap-2">
                <div className="bg-green-500 size-2 rounded-full" />
                <h2 className="font-semibold text-lg text-muted-foreground">
                  Reservas completadas
                </h2>
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  {bookings.filter((b) => b.status === "completed").length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="space-y-3">
                {bookings.filter((b) => b.status === "completed").length ===
                0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
                    No hay reservas completadas
                  </p>
                ) : (
                  bookings
                    .filter((b) => b.status === "completed")
                    .map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getBookingStatusBadge={getBookingStatusBadge}
                        DAYS_OF_WEEK={DAYS_OF_WEEK}
                        convertDayOfWeekToDisplayIndex={
                          convertDayOfWeekToDisplayIndex
                        }
                        handleUpdateStatus={handleUpdateStatus}
                        onDeleteClick={() => setBookingToDelete(booking)}
                      />
                    ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Otras Reservas */}
          {bookings.filter(
            (b) =>
              b.booking_date !== todayStr &&
              b.status !== "completed" &&
              b.status !== "pending"
          ).length > 0 && (
            <AccordionItem value="other" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2 px-1">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <h2 className="font-semibold text-lg text-muted-foreground">
                    Otras reservas
                  </h2>
                  <Badge variant="outline" className="text-xs">
                    {
                      bookings.filter(
                        (b) =>
                          b.booking_date !== todayStr &&
                          b.status !== "completed" &&
                          b.status !== "pending"
                      ).length
                    }
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="space-y-3">
                  {bookings
                    .filter(
                      (b) =>
                        b.booking_date !== todayStr &&
                        b.status !== "completed" &&
                        b.status !== "pending"
                    )
                    .map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getBookingStatusBadge={getBookingStatusBadge}
                        DAYS_OF_WEEK={DAYS_OF_WEEK}
                        convertDayOfWeekToDisplayIndex={
                          convertDayOfWeekToDisplayIndex
                        }
                        handleUpdateStatus={handleUpdateStatus}
                        onDeleteClick={() => setBookingToDelete(booking)}
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}

      <Dialog
        open={!!bookingToDelete}
        onOpenChange={() => setBookingToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              ¿Eliminar reserva?
            </DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar la reserva de{" "}
              <strong>{bookingToDelete?.user?.full_name}</strong> para el día{" "}
              <strong>
                {bookingToDelete && formatDate(bookingToDelete.booking_date)}
              </strong>
              . Esta acción no se puede deshacer y devolverá el crédito al
              usuario si la reserva estaba confirmada.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setBookingToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar Permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StandardPage>
  );
}

function BookingCard({
  booking,
  formatDate,
  formatTime,
  getBookingStatusBadge,
  DAYS_OF_WEEK,
  convertDayOfWeekToDisplayIndex,
  handleUpdateStatus,
  onDeleteClick,
}: {
  booking: BookingWithDetails;
  formatDate: (d: string) => string;
  formatTime: (t: string) => string;
  getBookingStatusBadge: (s: string) => React.ReactNode;
  DAYS_OF_WEEK: string[];
  convertDayOfWeekToDisplayIndex: (d: number) => number;
  handleUpdateStatus: (id: string, s: string) => void;
  onDeleteClick: () => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="size-4 text-primary" />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-sm block truncate">
                  {booking.user?.full_name || "Sin nombre"}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate">{booking.user?.email}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            {getBookingStatusBadge(booking.status)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-muted/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
              <Calendar className="size-3" />
              Fecha
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {formatDate(booking.booking_date)}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {booking.time_slot &&
                  DAYS_OF_WEEK[
                    convertDayOfWeekToDisplayIndex(
                      booking.time_slot.day_of_week
                    )
                  ]}
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
              <Clock className="size-3" />
              Horario
            </div>
            <div className="text-sm font-semibold">
              {booking.time_slot
                ? `${formatTime(booking.time_slot.start_time)} - ${formatTime(
                    booking.time_slot.end_time
                  )}`
                : "Eliminado"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t">
          <div className="flex-1 flex gap-2">
            {booking.status === "confirmed" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs font-semibold border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => handleUpdateStatus(booking.id, "completed")}
                >
                  Completar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                >
                  Cancelar
                </Button>
              </>
            )}
            {booking.status === "cancelled" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                className="flex-1 h-8 text-xs font-medium"
              >
                Restaurar reserva
              </Button>
            )}
            {booking.status === "completed" && (
              <div className="flex-1 text-center text-[10px] text-muted-foreground py-1.5 font-bold uppercase tracking-widest bg-muted/50 rounded-md flex items-center justify-center gap-1.5 transition-colors">
                <CheckCircle className="size-3" />
                Reserva Finalizada
              </div>
            )}

            {booking.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs font-semibold border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                >
                  Confirmar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                >
                  Rechazar
                </Button>
              </>
            )}
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={onDeleteClick}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-full shrink-0"
            title="Eliminar reserva"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
