import { useMemo, useCallback, useEffect } from "react";
import { useBookingStore } from "@/stores/bookingStore";
import { useProfileStore } from "@/stores/profileStore";
import { usePaymentRequestStore } from "@/stores/paymentRequestStore";
import type { NotificationItem } from "../types";
import { User, CreditCard, Calendar } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { getFullPath } from "@/lib/routeUtils";

export const useAggregatedNotifications = (isAdmin: boolean) => {
  const { items: bookings, fetchAll: fetchBookings } = useBookingStore();
  const { items: profiles, fetchAll: fetchProfiles } = useProfileStore();
  const { items: payments, fetchAll: fetchPayments } = usePaymentRequestStore();

  const notifications = useMemo(() => {
    if (!isAdmin) return [];

    const items: NotificationItem[] = [];

    // 1. Pending Profiles
    const pendingProfiles = profiles.filter(
      (p) => p.approval_status === "pending"
    );
    pendingProfiles.forEach((p) => {
      items.push({
        id: `profile-${p.id}`,
        title: "Nuevo usuario pendiente",
        description: `${p.full_name || p.email} requiere aprobación`,
        type: "action",
        timestamp: p.created_at || new Date().toISOString(),
        link: getFullPath(ROUTES.ADMIN.USERS),
        icon: User,
        actionLabel: "Revisar",
      });
    });

    // 2. Pending Payments
    const pendingPayments = payments.filter((p) => p.status === "pending");
    pendingPayments.forEach((p) => {
      items.push({
        id: `payment-${p.id}`,
        title: "Solicitud de créditos",
        description: `${p.user?.full_name || "Usuario"} solicitó ${
          p.credits_requested
        } créditos`,
        type: "warning",
        timestamp: p.created_at || new Date().toISOString(),
        link: getFullPath(ROUTES.ADMIN.PAYMENT_REQUESTS),
        icon: CreditCard,
        actionLabel: "Ver solicitud",
      });
    });

    // 3. Today's Bookings (Info)
    const today = new Date().toISOString().split("T")[0];
    const todayBookings = bookings.filter(
      (b) => b.booking_date === today && b.status === "confirmed"
    );

    if (todayBookings.length > 0) {
      items.push({
        id: `bookings-today`,
        title: "Clases de hoy",
        description: `${todayBookings.length} reservas confirmadas para hoy`,
        type: "info",
        timestamp: today,
        link: getFullPath(ROUTES.ADMIN.BOOKINGS),
        icon: Calendar,
        actionLabel: "Ver agenda",
      });
    }

    // Sort by date desc
    return items.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [isAdmin, bookings, profiles, payments]);

  const refresh = useCallback(() => {
    if (!isAdmin) return;
    fetchBookings();
    fetchProfiles();
    fetchPayments();
  }, [isAdmin, fetchBookings, fetchProfiles, fetchPayments]);

  useEffect(() => {
    if (isAdmin) {
      refresh();
    }
  }, [isAdmin, refresh]);

  return {
    notifications,
    count: notifications.length,
    refresh,
  };
};
