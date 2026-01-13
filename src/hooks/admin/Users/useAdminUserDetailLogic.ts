import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfileStore } from "@/stores/profileStore";
import { useBookingStore } from "@/stores/bookingStore";
import { usePaymentRequestStore } from "@/stores/paymentRequestStore";

export const useAdminUserDetailLogic = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const {
    items: profiles,
    isLoading: isUserLoading,
    fetchAll: fetchUsers,
    updateCredits,
    updatePaymentStatus,
  } = useProfileStore();

  const {
    items: allBookings,
    isLoading: isBookingsLoading,
    fetchAll: fetchBookings,
  } = useBookingStore();

  const {
    items: allPaymentRequests,
    isLoading: isPaymentsLoading,
    fetchAll: fetchPayments,
  } = usePaymentRequestStore();

  // Load data on mount
  useEffect(() => {
    const load = async () => {
      if (profiles.length === 0) await fetchUsers();
      fetchBookings();
      fetchPayments();
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Find user from profiles array instead of using select()
  // This prevents overwriting the currentItem which is used by useProfile()
  const user = useMemo(() => {
    if (userId && profiles.length > 0) {
      return profiles.find((p) => p.id === userId) || null;
    }
    return null;
  }, [userId, profiles]);

  // Computed data for specific user
  const userBookings = allBookings.filter((b) => b.user_id === userId);
  const userPayments = allPaymentRequests.filter((p) => p.user_id === userId);

  const isLoading = isUserLoading || isBookingsLoading || isPaymentsLoading;

  return {
    user,
    userBookings,
    userPayments,
    isLoading,
    updateCredits,
    updatePaymentStatus,
    navigate,
  };
};
