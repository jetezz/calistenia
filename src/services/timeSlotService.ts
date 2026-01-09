import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import type { CrudService } from "@/stores/BaseStore";

type TimeSlot = Database["public"]["Tables"]["time_slots"]["Row"];
type TimeSlotInsert = Database["public"]["Tables"]["time_slots"]["Insert"];
type TimeSlotUpdate = Database["public"]["Tables"]["time_slots"]["Update"];

const getAll = async (): Promise<TimeSlot[]> => {
  const { data, error } = await supabase
    .from("time_slots")
    .select("*")
    .order("slot_type", { ascending: true })
    .order("day_of_week", { ascending: true })
    .order("specific_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const getById = async (id: string): Promise<TimeSlot> => {
  const { data, error } = await supabase
    .from("time_slots")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

const create = async (timeSlot: TimeSlotInsert): Promise<TimeSlot> => {
  const { data, error } = await supabase
    .from("time_slots")
    .insert(timeSlot)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const update = async (
  id: string,
  updates: TimeSlotUpdate
): Promise<TimeSlot> => {
  const { data, error } = await supabase
    .from("time_slots")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const _delete = async (id: string): Promise<void> => {
  const { error } = await supabase.from("time_slots").delete().eq("id", id);

  if (error) throw error;
};

// Métodos específicos
const getActive = async () => {
  const { data, error } = await supabase
    .from("time_slots")
    .select("*")
    .eq("is_active", true)
    .order("slot_type", { ascending: true })
    .order("day_of_week", { ascending: true })
    .order("specific_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const getRecurringSlots = async () => {
  const { data, error } = await supabase
    .from("time_slots")
    .select("*")
    .eq("slot_type", "recurring")
    .eq("is_active", true)
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const getSpecificDateSlots = async (fromDate?: string, toDate?: string) => {
  let query = supabase
    .from("time_slots")
    .select("*")
    .eq("slot_type", "specific_date")
    .eq("is_active", true);

  if (fromDate) {
    query = query.gte("specific_date", fromDate);
  }

  if (toDate) {
    query = query.lte("specific_date", toDate);
  }

  const { data, error } = await query
    .order("specific_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const getAvailableSpots = async (slotId: string, targetDate: string) => {
  const { data, error } = await supabase.rpc("get_available_spots", {
    slot_id: slotId,
    target_date: targetDate,
  });

  if (error) throw error;
  return data as number;
};

const toggleActive = async (id: string, isActive: boolean) => {
  const { data, error } = await supabase
    .from("time_slots")
    .update({ is_active: isActive })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getByDayOfWeek = async (dayOfWeek: number) => {
  const { data, error } = await supabase
    .from("time_slots")
    .select("*")
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true)
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const getAvailableDatesInRange = async (fromDate: string, toDate: string) => {
  const [recurringSlots, specificSlots] = await Promise.all([
    getRecurringSlots(),
    getSpecificDateSlots(fromDate, toDate),
  ]);
  return { recurringSlots, specificSlots };
};

export const timeSlotService: CrudService<
  TimeSlot,
  TimeSlotInsert,
  TimeSlotUpdate
> & {
  getById: typeof getById;
  getActive: typeof getActive;
  getRecurringSlots: typeof getRecurringSlots;
  getSpecificDateSlots: typeof getSpecificDateSlots;
  getAvailableSpots: typeof getAvailableSpots;
  toggleActive: typeof toggleActive;
  getByDayOfWeek: typeof getByDayOfWeek;
  getAvailableDatesInRange: typeof getAvailableDatesInRange;
} = {
  getAll,
  create,
  update,
  delete: _delete,
  getById,
  getActive,
  getRecurringSlots,
  getSpecificDateSlots,
  getAvailableSpots,
  toggleActive,
  getByDayOfWeek,
  getAvailableDatesInRange,
};
