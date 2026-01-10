import { useEffect, useMemo, useCallback } from "react";
import { useBookingStore } from "@/stores/bookingStore";
import { usePaymentRequestStore } from "@/stores/paymentRequestStore";
import { useProfile } from "@/features/auth";

export const useHomeLogic = () => {
  const { profile, refreshProfile } = useProfile();
  const userId = profile?.id;

  const {
    items: bookings,
    isLoading: isBookingsLoading,
    fetchAll: fetchBookings,
  } = useBookingStore();

  const {
    items: paymentRequests,
    isLoading: isPaymentsLoading,
    fetchAll: fetchPayments,
  } = usePaymentRequestStore();

  useEffect(() => {
    fetchBookings();
    fetchPayments();
  }, [fetchBookings, fetchPayments]);

  const upcomingBookings = useMemo(() => {
    if (!userId) return [];
    const now = new Date();
    // Set to start of today to include today's bookings
    now.setHours(0, 0, 0, 0);

    return bookings
      .filter((b) => {
        const isUserBooking = b.user_id === userId;
        const isConfirmed = b.status === "confirmed";
        const bookingDate = new Date(b.booking_date);
        return isUserBooking && isConfirmed && bookingDate >= now;
      })
      .sort(
        (a, b) =>
          new Date(a.booking_date).getTime() -
          new Date(b.booking_date).getTime()
      )
      .slice(0, 3); // Just the next 3
  }, [bookings, userId]);

  const allPaymentRequests = useMemo(() => {
    if (!userId) return [];
    return paymentRequests
      .filter((p) => p.user_id === userId)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [paymentRequests, userId]);

  const recentPaymentRequests = useMemo(() => {
    return allPaymentRequests.slice(0, 3);
  }, [allPaymentRequests]);

  const isLoading = isBookingsLoading || isPaymentsLoading;

  const refreshDashboard = useCallback(async () => {
    await Promise.all([
      fetchBookings(true),
      fetchPayments(true),
      refreshProfile(),
    ]);
  }, [fetchBookings, fetchPayments, refreshProfile]);

  return {
    upcomingBookings,
    recentPaymentRequests,
    allPaymentRequests,
    isLoading,
    refreshDashboard,
  };
};
