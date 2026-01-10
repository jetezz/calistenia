import { useEffect, useMemo, useCallback } from "react";
import { useBookingStore } from "@/stores/bookingStore";
import { useProfileStore } from "@/stores/profileStore";
import { useAppSettingsStore } from "@/stores/appSettingsStore";
import { useToast } from "@/hooks/useToast";
import type { Database } from "@/types/database";

type BookingWithRelations = Database["public"]["Tables"]["bookings"]["Row"] & {
  time_slot: Database["public"]["Tables"]["time_slots"]["Row"];
};

export const useMyBookingsLogic = (userId?: string) => {
  // Stores
  const {
    items: allBookings,
    isLoading: isBookingsLoading,
    update: updateBooking,
    fetchAll: fetchAllBookings,
  } = useBookingStore();

  const { items: profiles, fetchAll: fetchProfiles } = useProfileStore();

  const { getSettingValue, fetchAll: fetchSettings } = useAppSettingsStore();

  // Toast notifications
  const { success, error: showError } = useToast();

  // Get user's bookings
  const userBookings = useMemo(
    () =>
      userId
        ? (allBookings.filter(
            (b) => b.user_id === userId
          ) as BookingWithRelations[])
        : [],
    [userId, allBookings]
  );

  // Get user profile
  const userProfile = userId
    ? profiles.find((p) => p.id === userId)
    : undefined;

  // Get cancellation policy from settings
  const cancellationPolicy = useMemo(() => {
    return getSettingValue("cancellation_policy", { value: 0, unit: "hours" });
  }, [getSettingValue]);

  // Initial fetch
  useEffect(() => {
    fetchAllBookings();
    fetchProfiles();
    fetchSettings();
  }, [fetchAllBookings, fetchProfiles, fetchSettings]);

  // Get upcoming bookings
  const upcomingBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return userBookings
      .filter((booking) => {
        const bookingDate = new Date(booking.booking_date);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate >= today && booking.status !== "cancelled";
      })
      .sort((a, b) => a.booking_date.localeCompare(b.booking_date));
  }, [userBookings]);

  // Get past bookings
  const pastBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return userBookings
      .filter((booking) => {
        const bookingDate = new Date(booking.booking_date);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate < today || booking.status === "cancelled";
      })
      .sort((a, b) => b.booking_date.localeCompare(a.booking_date));
  }, [userBookings]);

  // Check if a booking can be cancelled
  const canCancelBooking = useCallback(
    (booking: BookingWithRelations) => {
      if (booking.status !== "confirmed") return false;

      if (!cancellationPolicy) return false;

      // Parse cancellation policy
      const policyValue = cancellationPolicy.value || 0;
      const policyUnit = cancellationPolicy.unit || "hours";

      if (policyValue === 0) return true;

      const bookingDateTime = new Date(
        `${booking.booking_date}T${booking.time_slot.start_time}`
      );
      const now = new Date();

      let minAdvanceTime: number;
      if (policyUnit === "hours") {
        minAdvanceTime = policyValue;
      } else {
        minAdvanceTime = policyValue * 24;
      }

      const hoursDiff =
        (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      return hoursDiff > minAdvanceTime;
    },
    [cancellationPolicy]
  );

  // Cancel a booking
  const cancelBooking = useCallback(
    async (bookingId: string) => {
      if (!userId) {
        showError("Debes iniciar sesión para cancelar reservas");
        return;
      }

      try {
        await updateBooking(bookingId, { status: "cancelled" });
        success("Reserva cancelada correctamente. Crédito devuelto");
        await fetchAllBookings();
        await fetchProfiles();
      } catch (error) {
        console.error("Error cancelling booking:", error);
        showError("Error al cancelar la reserva");
      }
    },
    [userId, updateBooking, fetchAllBookings, fetchProfiles, success, showError]
  );

  // Refresh all data
  const refresh = useCallback(() => {
    fetchAllBookings(true);
    fetchProfiles(true);
    fetchSettings(true);
  }, [fetchAllBookings, fetchProfiles, fetchSettings]);

  // Get cancellation policy info
  const getCancellationPolicy = useCallback(() => {
    return {
      value: cancellationPolicy?.value || 0,
      unit: cancellationPolicy?.unit || "hours",
    };
  }, [cancellationPolicy]);

  return {
    // Data
    bookings: userBookings,
    upcomingBookings,
    pastBookings,
    userProfile,

    // UI State
    isLoading: isBookingsLoading,

    // Actions
    cancelBooking,
    canCancelBooking,
    refresh,

    // Settings
    getCancellationPolicy,
  };
};
