import { useEffect } from "react";
import { useTimeSlotStore } from "@/stores/timeSlotStore";
import type { Database } from "@/types/database";

type TimeSlotInsert = Database["public"]["Tables"]["time_slots"]["Insert"];
type TimeSlotUpdate = Database["public"]["Tables"]["time_slots"]["Update"];

export const useAdminSlotsLogic = () => {
  const {
    items: slots,
    isLoading,
    error,
    fetchAll,
    create: createSlot,
    update: updateSlot,
    delete: deleteSlot,
    toggleActive,
  } = useTimeSlotStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreateSlot = async (data: TimeSlotInsert) => {
    await createSlot(data);
  };

  const handleUpdateSlot = async (id: string, data: TimeSlotUpdate) => {
    await updateSlot(id, data);
  };

  const handleDeleteSlot = async (id: string) => {
    await deleteSlot(id);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleActive(id, isActive);
  };

  return {
    slots,
    isLoading,
    error,
    refresh: () => fetchAll(true),
    createSlot: handleCreateSlot,
    updateSlot: handleUpdateSlot,
    deleteSlot: handleDeleteSlot,
    toggleActive: handleToggleActive,
  };
};
