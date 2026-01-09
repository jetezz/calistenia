import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfileStore } from "@/stores/profileStore";
import { useBookingStore } from "@/stores/bookingStore";
import { usePaymentRequestStore } from "@/stores/paymentRequestStore";

export const useAdminUserDetailLogic = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const {
    items: profiles,
    currentItem: user,
    isLoading: isUserLoading,
    select: selectUser,
    fetchAll: fetchUsers, // Ensure we have data if refreshed on this page
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
    // If we don't have the user, we might need to fetch all users or implement fetchById in store
    // Current BaseStore implementation of fetchById is missing, relies on select from getAll.
    // We will trigger fetchAll if list is empty, then select.

    const load = async () => {
      if (profiles.length === 0) await fetchUsers();
      fetchBookings();
      fetchPayments();
    };
    load();
  }, []);

  // Effect to select user once profiles are loaded or when userId changes
  useEffect(() => {
    if (userId) {
      selectUser(userId);
    }
    return () => selectUser(null);
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
