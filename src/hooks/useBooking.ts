import { useCallback, useMemo } from "react";
import { useBookingStore } from "@/stores";
import { bookingService } from "@/services/bookingService";
import type { Database } from "@/types/database";

type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

export const useBooking = () => {
  const store = useBookingStore();

  const fetchBookings = useCallback(async () => {
    await store.fetchAll();
  }, [store]);

  const fetchBookingById = useCallback(
    async (id: string) => {
      let booking = store.items.find((i) => i.id === id);
      if (!booking) {
        booking = await bookingService.getById(id);
      }
      store.select(id);
      return booking;
    },
    [store]
  );

  const fetchUserBookings = useCallback(
    async (userId: string, limit?: number) => {
      // Adapter logic: if we have items, we could filter them, but service has specific logic (limit)
      return await bookingService.getByUserId(userId, limit);
    },
    []
  );

  const fetchUpcomingBookings = useCallback(
    async (userId: string, limit?: number) => {
      return await bookingService.getUpcomingByUserId(userId, limit);
    },
    []
  );

  const fetchBookingsByDateRange = useCallback(
    async (startDate: string, endDate: string) => {
      return await bookingService.getByDateRange(startDate, endDate);
    },
    []
  );

  const createBooking = useCallback(
    async (bookingData: BookingInsert) => {
      return await store.create(bookingData);
    },
    [store]
  );

  const updateBookingData = useCallback(
    async (id: string, updates: BookingUpdate) => {
      return await store.update(id, updates);
    },
    [store]
  );

  const cancelBooking = useCallback(
    async (id: string) => {
      const cancelled = await bookingService.cancel(id);
      await store.fetchAll(); // Refresh to get updated state
      return cancelled;
    },
    [store]
  );

  const deleteBooking = useCallback(
    async (id: string) => {
      return await store.delete(id);
    },
    [store]
  );

  const checkBookingConflict = useCallback(
    async (userId: string, timeSlotId: string, bookingDate: string) => {
      return await bookingService.checkBookingConflict(
        userId,
        timeSlotId,
        bookingDate
      );
    },
    []
  );

  return {
    // State
    bookings: store.items,
    currentBooking: store.currentItem,
    loading: store.isLoading,
    error: store.error,

    // Actions
    fetchBookings,
    fetchBookingById,
    fetchUserBookings,
    fetchUpcomingBookings,
    fetchBookingsByDateRange,
    createBooking,
    updateBooking: updateBookingData,
    cancelBooking,
    deleteBooking,
    checkBookingConflict,
    setCurrentBooking: store.select,
  };
};
