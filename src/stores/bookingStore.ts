import { create } from "zustand";
import { createBaseStore, type BaseStoreState } from "./BaseStore";
import { bookingService } from "@/services/bookingService";
import type { Database } from "@/types/database";

// Tipos derivados de la base de datos
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];
type TimeSlot = Database["public"]["Tables"]["time_slots"]["Row"];

// Tipo extendido que usa el servicio
type BookingWithRelations = Booking & {
  time_slot: TimeSlot | null;
  user: { id: string; full_name: string | null; email: string } | null;
};

interface BookingStore
  extends BaseStoreState<BookingWithRelations, BookingInsert, BookingUpdate> {
  // Métodos personalizados pueden añadirse aquí si el BaseStore no es suficiente
  fetchByDateRange: (startDate: string, endDate: string) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set, get, store) => {
  // Creamos el store base
  const baseStore = createBaseStore<
    BookingWithRelations,
    BookingInsert,
    BookingUpdate
  >(bookingService)(set, get, store);

  return {
    ...baseStore,

    // Extensión con métodos específicos
    fetchByDateRange: async (startDate: string, endDate: string) => {
      set({ isLoading: true, error: null });
      try {
        const items = await bookingService.getByDateRange(startDate, endDate);
        set({ items, isLoading: false });
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message, isLoading: false });
      }
    },
  };
});
