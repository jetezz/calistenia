import { useEffect, useMemo } from "react";
import { useBookingStore } from "@/stores/bookingStore";
import { useProfileStore } from "@/stores/profileStore";
import { usePaymentRequestStore } from "@/stores/paymentRequestStore";
import { useTimeSlotStore } from "@/stores/timeSlotStore";
import { useNotifications } from "@/hooks/useNotifications";

export const useDashboardLogic = () => {
  // Stores
  const {
    items: bookings,
    isLoading: isBookingsLoading,
    fetchAll: fetchBookings,
  } = useBookingStore();

  const {
    items: profiles,
    isLoading: isProfilesLoading,
    fetchAll: fetchProfiles,
  } = useProfileStore();

  const {
    items: paymentRequests,
    isLoading: isPaymentsLoading,
    fetchAll: fetchPayments,
  } = usePaymentRequestStore();

  const {
    activeSlots,
    isLoading: isSlotsLoading,
    fetchActive: fetchActiveSlots,
  } = useTimeSlotStore();

  // Loading & Error States
  const isLoading =
    isBookingsLoading ||
    isProfilesLoading ||
    isPaymentsLoading ||
    isSlotsLoading;

  // Initial Fetch
  useEffect(() => {
    // Only fetch if empty? Or always refresh on dashboard mount?
    // For dashboard, freshness is good. We can optimize later to check if already populated.
    fetchBookings();
    fetchProfiles();
    fetchPayments();
    fetchActiveSlots();
  }, [fetchBookings, fetchProfiles, fetchPayments, fetchActiveSlots]);

  // Computed Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return {
      todayBookingsCount: bookings.filter((b) => {
        return b.booking_date === today && b.status === "confirmed";
      }).length,
      pendingPaymentRequestsCount: paymentRequests.filter(
        (p) => p.status === "pending"
      ).length,
      totalUsersCount: profiles.filter((p) => p.role === "user").length,
      activeTimeSlotsCount: activeSlots.length,
    };
  }, [bookings, paymentRequests, profiles, activeSlots]);

  // Notifications Logic (reusing existing hook logic pattern)
  const { newBookingsCount, markAsSeen } = useNotifications(
    true,
    stats.todayBookingsCount
  );

  const refresh = () => {
    fetchBookings();
    fetchProfiles();
    fetchPayments();
    fetchActiveSlots();
  };

  return {
    // Data
    bookings,
    paymentRequests,
    profiles,
    activeSlots,

    // Stats
    stats,
    newBookingsCount,

    // UI State
    isLoading,

    // Actions
    refresh,
    markAsSeen,
  };
};
