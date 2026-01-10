import { create } from "zustand";
import { createBaseStore, type BaseStoreState } from "./BaseStore";
import { timeSlotService } from "@/services/timeSlotService";
import type { Database } from "@/types/database";

type TimeSlot = Database["public"]["Tables"]["time_slots"]["Row"];
type TimeSlotInsert = Database["public"]["Tables"]["time_slots"]["Insert"];
type TimeSlotUpdate = Database["public"]["Tables"]["time_slots"]["Update"];

interface TimeSlotStore
  extends BaseStoreState<TimeSlot, TimeSlotInsert, TimeSlotUpdate> {
  activeSlots: TimeSlot[];
  availabilityCache: Record<string, number>;
  fetchActive: (force?: boolean) => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  setActiveSlots: (slots: TimeSlot[]) => void;
  addItem: (slot: TimeSlot) => void;
  updateItem: (id: string, slot: TimeSlot) => void;
  removeItem: (id: string) => void;
  setAvailability: (slotId: string, date: string, spots: number) => void;
  getAvailability: (slotId: string, date: string) => number | undefined;
}

export const useTimeSlotStore = create<TimeSlotStore>((set, get, store) => {
  const baseStore = createBaseStore<TimeSlot, TimeSlotInsert, TimeSlotUpdate>(
    timeSlotService
  )(set, get, store);

  return {
    ...baseStore,
    activeSlots: [],
    availabilityCache: {},

    fetchActive: async (force = false) => {
      // Si ya tenemos todos los items cargados y no forzamos, filtramos localmente
      if (!force && get().isInitialized) {
        set({ activeSlots: get().items.filter((i) => i.is_active) });
        return;
      }

      // Consolidar en fetchAll para evitar duplicados
      await get().fetchAll(force);
      set({ activeSlots: get().items.filter((i) => i.is_active) });
    },

    toggleActive: async (id, isActive) => {
      // Optimistic update
      set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, is_active: isActive } : i
        ),
        activeSlots: isActive
          ? [...state.activeSlots, state.items.find((i) => i.id === id)!]
          : state.activeSlots.filter((i) => i.id !== id),
      }));

      try {
        await timeSlotService.toggleActive(id, isActive);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message });
      }
    },

    setAvailability: (slotId, date, spots) => {
      set((state) => ({
        availabilityCache: {
          ...state.availabilityCache,
          [`${slotId}-${date}`]: spots,
        },
      }));
    },

    getAvailability: (slotId, date) => {
      return get().availabilityCache[`${slotId}-${date}`];
    },

    setActiveSlots: (activeSlots) => set({ activeSlots }),

    addItem: (slot) => set((state) => ({ items: [slot, ...state.items] })),

    updateItem: (id, slot) =>
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? slot : i)),
      })),

    removeItem: (id) =>
      set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  };
});
