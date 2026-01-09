import { useCallback } from "react";
import { useTimeSlotStore } from "@/stores";
import { timeSlotService } from "@/services/timeSlotService";
import type { Database } from "@/types/database";

type TimeSlotInsert = Database["public"]["Tables"]["time_slots"]["Insert"];
type TimeSlotUpdate = Database["public"]["Tables"]["time_slots"]["Update"];

export const useTimeSlot = () => {
  const store = useTimeSlotStore();

  const fetchTimeSlots = useCallback(
    async (force = false) => {
      await store.fetchAll(force);
    },
    [store]
  );

  const fetchActiveTimeSlots = useCallback(async () => {
    await store.fetchActive();
    return store.activeSlots;
  }, [store]);

  const fetchRecurringSlots = useCallback(async () => {
    await store.fetchAll();
    return store.items.filter(
      (i) => i.slot_type === "recurring" && i.is_active
    );
  }, [store]);

  const fetchSpecificDateSlots = useCallback(
    async (fromDate?: string, toDate?: string) => {
      await store.fetchAll();
      let slots = store.items.filter(
        (i) => i.slot_type === "specific_date" && i.is_active
      );
      if (fromDate) {
        slots = slots.filter(
          (i) => i.specific_date && i.specific_date >= fromDate
        );
      }
      if (toDate) {
        slots = slots.filter(
          (i) => i.specific_date && i.specific_date <= toDate
        );
      }
      return slots.sort((a, b) => {
        // Basic sort by date then time
        if (a.specific_date !== b.specific_date)
          return (a.specific_date || "").localeCompare(b.specific_date || "");
        return a.start_time.localeCompare(b.start_time);
      });
    },
    [store]
  );

  const getAvailableDatesInRange = useCallback(
    async (fromDate: string, toDate: string) => {
      await store.fetchAll();

      const recurringSlots = store.items
        .filter((i) => i.slot_type === "recurring" && i.is_active)
        .sort((a, b) => {
          if (a.day_of_week !== b.day_of_week)
            return a.day_of_week - b.day_of_week;
          return a.start_time.localeCompare(b.start_time);
        });

      const specificSlots = store.items
        .filter(
          (i) =>
            i.slot_type === "specific_date" &&
            i.is_active &&
            i.specific_date &&
            i.specific_date >= fromDate &&
            i.specific_date <= toDate
        )
        .sort((a, b) => {
          if (a.specific_date !== b.specific_date)
            return (a.specific_date || "").localeCompare(b.specific_date || "");
          return a.start_time.localeCompare(b.start_time);
        });

      return { recurringSlots, specificSlots };
    },
    [store]
  );

  const fetchTimeSlotById = useCallback(
    async (id: string) => {
      // Adapter style: try to find in items first
      let slot = store.items.find((i) => i.id === id);
      if (!slot) {
        slot = await timeSlotService.getById(id);
      }
      store.select(id);
      return slot;
    },
    [store]
  );

  const fetchTimeSlotsByDay = useCallback(async (dayOfWeek: number) => {
    return await timeSlotService.getByDayOfWeek(dayOfWeek);
  }, []);

  const fetchAvailableSpots = useCallback(
    async (slotId: string, targetDate: string) => {
      return await timeSlotService.getAvailableSpots(slotId, targetDate);
    },
    []
  );

  const createTimeSlot = useCallback(
    async (timeSlotData: TimeSlotInsert) => {
      return await store.create(timeSlotData);
    },
    [store]
  );

  const updateTimeSlotData = useCallback(
    async (id: string, updates: TimeSlotUpdate) => {
      return await store.update(id, updates);
    },
    [store]
  );

  const toggleTimeSlotActive = useCallback(
    async (id: string, isActive: boolean) => {
      return await store.toggleActive(id, isActive);
    },
    [store]
  );

  const deleteTimeSlot = useCallback(
    async (id: string) => {
      return await store.delete(id);
    },
    [store]
  );

  return {
    // State
    timeSlots: store.items,
    activeTimeSlots: store.activeSlots,
    currentTimeSlot: store.currentItem,
    loading: store.isLoading,
    error: store.error,

    // Actions
    fetchTimeSlots,
    fetchActiveTimeSlots,
    fetchRecurringSlots,
    fetchSpecificDateSlots,
    getAvailableDatesInRange,
    fetchTimeSlotById,
    fetchTimeSlotsByDay,
    fetchAvailableSpots,
    createTimeSlot,
    updateTimeSlot: updateTimeSlotData,
    toggleTimeSlotActive,
    deleteTimeSlot,
    setCurrentTimeSlot: store.select,
  };
};
