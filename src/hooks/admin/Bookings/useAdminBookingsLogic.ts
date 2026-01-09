import { useEffect } from "react";
import { useBookingStore } from "@/stores/bookingStore";

export const useAdminBookingsLogic = () => {
  const {
    items: bookings,
    isLoading,
    error,
    fetchAll,
    update: updateBooking,
    delete: deleteBooking,
  } = useBookingStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await updateBooking(id, { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
      await deleteBooking(id);
    }
  };

  return {
    bookings,
    isLoading,
    error,
    handleUpdateStatus,
    handleDelete,
    refresh: fetchAll,
  };
};
