import { useState, useEffect, useCallback, useMemo } from "react";
import { useTimeSlotStore } from "@/stores/timeSlotStore";
import { useBookingStore } from "@/stores/bookingStore";
import { useProfile } from "@/features/auth";
import { useToast } from "@/hooks/useToast";
import type { Database } from "@/types/database";

interface BookingAvailability {
  capacity: number;
  booked: number;
  available: number;
}

export const useBookingLogic = (userId?: string) => {
  // Stores
  const {
    activeSlots: timeSlots,
    isLoading: isSlotsLoading,
    fetchActive: fetchActiveTimeSlots,
  } = useTimeSlotStore();

  const {
    items: allBookings,
    isLoading: isBookingsLoading,
    create: createBookingInStore,
    fetchAll: fetchAllBookings,
  } = useBookingStore();

  const { profile: userProfile, refreshProfile } = useProfile();

  // Local state
  const [bookingAvailability, setBookingAvailability] = useState<
    Record<string, BookingAvailability>
  >({});
  const [isBooking, setIsBooking] = useState(false);

  // Toast notifications
  const {
    success,
    error: showError,
    loading: showLoading,
    dismiss,
  } = useToast();

  // Loading state
  const isLoading = isSlotsLoading || isBookingsLoading;

  // Get user's bookings (memoized to prevent dependency issues)
  const userBookings = useMemo(
    () => (userId ? allBookings.filter((b) => b.user_id === userId) : []),
    [userId, allBookings]
  );

  // Initial fetch
  useEffect(() => {
    fetchActiveTimeSlots(true);
    fetchAllBookings(true);
    refreshProfile();
  }, [fetchActiveTimeSlots, fetchAllBookings, refreshProfile]);

  // Fetch availability for a specific time slot and date
  const fetchAvailability = useCallback(
    async (timeSlotId: string, bookingDate: string) => {
      try {
        const key = `${timeSlotId}-${bookingDate}`;

        // Count bookings for this slot and date
        const bookedCount = allBookings.filter(
          (b) =>
            b.time_slot_id === timeSlotId &&
            b.booking_date === bookingDate &&
            b.status === "confirmed"
        ).length;

        // Get the time slot to know total capacity
        const timeSlot = timeSlots.find((ts) => ts.id === timeSlotId);
        const totalSpots = timeSlot?.capacity || 0;

        const formattedAvailability = {
          capacity: totalSpots,
          booked: bookedCount,
          available: totalSpots - bookedCount,
        };

        setBookingAvailability((prev) => ({
          ...prev,
          [key]: formattedAvailability,
        }));
        return formattedAvailability;
      } catch (error) {
        console.error("Error fetching availability:", error);
        return null;
      }
    },
    [allBookings, timeSlots]
  );

  // Get availability from cache
  const getAvailability = useCallback(
    (timeSlotId: string, bookingDate: string) => {
      const key = `${timeSlotId}-${bookingDate}`;
      return bookingAvailability[key] || null;
    },
    [bookingAvailability]
  );

  // Check if user has a booking conflict
  const checkBookingConflict = useCallback(
    (timeSlotId: string, bookingDate: string) => {
      if (!userId) return false;

      return userBookings.some(
        (b) =>
          b.time_slot_id === timeSlotId &&
          b.booking_date === bookingDate &&
          b.status === "confirmed"
      );
    },
    [userId, userBookings]
  );

  // Create a new booking
  const createBooking = useCallback(
    async (timeSlotId: string, bookingDate: string) => {
      if (!userId || !userProfile) {
        showError("Debes iniciar sesión para reservar");
        return null;
      }

      if (userProfile.credits <= 0) {
        showError("No tienes créditos suficientes para reservar");
        return null;
      }

      try {
        setIsBooking(true);
        const loadingToast = showLoading("Procesando reserva...");

        // Check for conflicts
        const hasConflict = checkBookingConflict(timeSlotId, bookingDate);
        if (hasConflict) {
          showError("Ya tienes una reserva para esta fecha y horario");
          return null;
        }

        // Check availability
        const availability = await fetchAvailability(timeSlotId, bookingDate);
        if (!availability || availability.available <= 0) {
          showError("No hay plazas disponibles para esta fecha y horario");
          return null;
        }

        // Create booking
        const newBooking: Database["public"]["Tables"]["bookings"]["Insert"] = {
          user_id: userId,
          time_slot_id: timeSlotId,
          booking_date: bookingDate,
        };

        const booking = await createBookingInStore(newBooking);

        // Refresh data
        await fetchAllBookings(true);
        await refreshProfile();
        await fetchAvailability(timeSlotId, bookingDate);

        dismiss(loadingToast);
        success("¡Reserva realizada con éxito!");

        return booking;
      } catch (error) {
        console.error("Error creating booking:", error);
        showError("Error al realizar la reserva");
        return null;
      } finally {
        setIsBooking(false);
      }
    },
    [
      userId,
      userProfile,
      checkBookingConflict,
      fetchAvailability,
      createBookingInStore,
      fetchAllBookings,
      refreshProfile,
      showError,
      showLoading,
      success,
      dismiss,
    ]
  );

  // Refresh all data
  const refresh = useCallback(() => {
    fetchActiveTimeSlots(true);
    fetchAllBookings(true);
    refreshProfile();
  }, [fetchActiveTimeSlots, fetchAllBookings, refreshProfile]);

  return {
    // Data
    timeSlots,
    userBookings,
    userProfile,

    // Availability
    bookingAvailability,
    getAvailability,
    fetchAvailability,

    // UI State
    isLoading,
    isBooking,

    // Actions
    createBooking,
    checkBookingConflict,
    refresh,
  };
};
