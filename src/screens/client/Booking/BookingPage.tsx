import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { formatDateToLocalString, formatTime } from "@/lib/dateUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StandardPage } from "@/components/common";
import { useBookingLogic } from "@/hooks/client/Booking/useBookingLogic";
import { useAuth } from "@/features/auth";

const DAYS_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const getWeekDates = (startDate: Date) => {
  const dates = [];
  const current = new Date(startDate);

  // Find the start of the week (Monday)
  const dayOfWeek = current.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  current.setDate(current.getDate() + mondayOffset);

  for (let i = 0; i < 7; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export function BookingPage() {
  const { user } = useAuth();
  const {
    timeSlots,
    userBookings,
    userProfile,
    isLoading,
    isBooking,
    createBooking,
    fetchAvailability,
    getAvailability,
    refresh,
  } = useBookingLogic(user?.id);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewWeek, setViewWeek] = useState<Date>(new Date());

  const formatDate = useCallback((date: Date) => {
    return formatDateToLocalString(date);
  }, []);

  const weekDates = useMemo(() => getWeekDates(viewWeek), [viewWeek]);

  const goToPreviousWeek = () => {
    const newWeek = new Date(viewWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setViewWeek(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = new Date(viewWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setViewWeek(newWeek);
  };

  const goToToday = () => {
    const today = new Date();
    setViewWeek(today);
    setSelectedDate(today);
  };

  const handleBooking = async (timeSlotId: string, bookingDate: string) => {
    const booking = await createBooking(timeSlotId, bookingDate);
    if (booking) {
      await fetchAvailability(timeSlotId, bookingDate);
    }
  };

  const getSlotsForDay = useCallback(
    (dayOfWeek: number) => {
      return timeSlots.filter((slot) => slot.day_of_week === dayOfWeek);
    },
    [timeSlots]
  );

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const isSelectedDate = (date: Date) => {
    return formatDate(date) === formatDate(selectedDate);
  };

  const hasAvailableSlots = (date: Date) => {
    const dayOfWeek = date.getDay();
    const slots = getSlotsForDay(dayOfWeek);

    return slots.some((slot) => {
      const availability = getAvailability(slot.id, formatDate(date));
      return availability && availability.available > 0;
    });
  };

  const hasBookingOnDate = (date: Date) => {
    const dateStr = formatDate(date);
    return userBookings.some(
      (booking) =>
        booking.booking_date === dateStr && booking.status === "confirmed"
    );
  };

  const isSlotBooked = (timeSlotId: string, date: Date) => {
    const dateStr = formatDate(date);
    return userBookings.some(
      (booking) =>
        booking.time_slot_id === timeSlotId &&
        booking.booking_date === dateStr &&
        booking.status === "confirmed"
    );
  };

  // Load availability for visible time slots when dates change
  useEffect(() => {
    const loadAvailability = async () => {
      for (const date of weekDates) {
        const dayOfWeek = date.getDay();
        const slots = getSlotsForDay(dayOfWeek);

        for (const slot of slots) {
          await fetchAvailability(slot.id, formatDate(date));
        }
      }
    };

    if (timeSlots.length > 0) {
      loadAvailability();
    }
  }, [weekDates, timeSlots, formatDate, getSlotsForDay, fetchAvailability]);

  return (
    <StandardPage
      icon={CalendarDays}
      title="Reservar Clase"
      description={
        userProfile
          ? `${userProfile.credits ?? 0} créditos disponibles`
          : "Cargando créditos..."
      }
      onRefresh={refresh}
      isLoading={isLoading}
      loadingMessage="Cargando horarios disponibles..."
      actionButton={
        <Button onClick={goToToday} variant="outline" size="sm">
          <Calendar className="size-4 mr-1" />
          Hoy
        </Button>
      }
      maxWidth="max-w-4xl"
    >
      {timeSlots.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarDays className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No hay horarios disponibles
            </h3>
            <p className="text-muted-foreground">
              Los horarios aparecerán aquí cuando estén configurados
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Week Navigation */}
          {/* Week Navigation */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button
                  onClick={goToPreviousWeek}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <CardTitle className="text-center text-base">
                  {weekDates[0].toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
                <Button
                  onClick={goToNextWeek}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-2 px-2">
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map((date, index) => {
                  const hasSlots = hasAvailableSlots(date);
                  const isTodayDate = isToday(date);
                  const isBooked = hasBookingOnDate(date);

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      disabled={isPastDate(date)}
                      className={`p-1.5 text-center rounded-md border transition-colors relative h-16 flex flex-col justify-center ${
                        isPastDate(date)
                          ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                          : isSelectedDate(date)
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : isBooked
                          ? "border-blue-400 bg-blue-50"
                          : isTodayDate
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted border-border"
                      }`}
                    >
                      <div
                        className={`text-[9px] leading-none mb-1 uppercase ${
                          isBooked && !isSelectedDate(date)
                            ? "text-blue-600 font-medium"
                            : isTodayDate && !isSelectedDate(date)
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {DAYS_SHORT[date.getDay()]}
                      </div>
                      <div className="text-sm font-bold leading-none">
                        {date.getDate()}
                      </div>
                      {hasSlots && !isPastDate(date) && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                          <div
                            className={`w-1 h-1 rounded-full ${
                              isSelectedDate(date)
                                ? "bg-primary-foreground"
                                : "bg-green-500"
                            }`}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Available Slots for Selected Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Clock className="size-4 text-muted-foreground" />
              <h2 className="font-semibold text-base">
                {selectedDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h2>
            </div>

            {(() => {
              const dayOfWeek = selectedDate.getDay();
              const daySlots = getSlotsForDay(dayOfWeek);

              if (daySlots.length === 0) {
                return (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Clock className="size-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">
                        No hay horarios disponibles para este día
                      </p>
                    </CardContent>
                  </Card>
                );
              }

              return (
                <div className="space-y-2">
                  {daySlots
                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                    .map((slot) => {
                      const availability = getAvailability(
                        slot.id,
                        formatDate(selectedDate)
                      );
                      const isAvailable =
                        availability && availability.available > 0;
                      const slotBooked = isSlotBooked(slot.id, selectedDate);
                      const canBook =
                        !isPastDate(selectedDate) &&
                        isAvailable &&
                        (userProfile?.credits ?? 0) > 0 &&
                        !isBooking &&
                        !slotBooked;

                      return (
                        <div
                          key={slot.id}
                          className={`p-3 rounded-lg border ${
                            slotBooked
                              ? "border-blue-200 bg-blue-50"
                              : isAvailable
                              ? "border-green-200 bg-green-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-base">
                                  {formatTime(slot.start_time)} -{" "}
                                  {formatTime(slot.end_time)}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Users className="size-3" />
                                  {availability ? (
                                    <span>
                                      {availability.available}/
                                      {availability.capacity} plazas
                                    </span>
                                  ) : (
                                    <span>Cargando...</span>
                                  )}
                                </div>
                              </div>
                              <Badge
                                variant={
                                  slotBooked
                                    ? "default"
                                    : isAvailable
                                    ? "default"
                                    : "secondary"
                                }
                                className={`text-xs ${
                                  slotBooked
                                    ? "bg-blue-500 text-white"
                                    : isAvailable
                                    ? "bg-green-500 text-white"
                                    : ""
                                }`}
                              >
                                {slotBooked
                                  ? "Reservado"
                                  : availability && availability.available > 0
                                  ? "Disponible"
                                  : "Completo"}
                              </Badge>
                            </div>

                            <Button
                              className="w-full h-9 text-sm"
                              disabled={!canBook}
                              onClick={() =>
                                handleBooking(slot.id, formatDate(selectedDate))
                              }
                            >
                              {slotBooked
                                ? "Ya tienes reserva"
                                : (userProfile?.credits ?? 0) <= 0
                                ? "Sin créditos"
                                : isBooking
                                ? "Reservando..."
                                : "Reservar (1 crédito)"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })()}
          </div>
        </>
      )}
    </StandardPage>
  );
}
