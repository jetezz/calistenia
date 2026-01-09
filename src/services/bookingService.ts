import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import type { CrudService } from "@/stores/BaseStore";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];
type TimeSlot = Database["public"]["Tables"]["time_slots"]["Row"];

// Extended type including relations commonly fetched
type BookingWithRelations = Booking & {
  time_slot: TimeSlot | null;
  user: { id: string; full_name: string | null; email: string } | null;
};

const getAll = async (): Promise<BookingWithRelations[]> => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      time_slot:time_slots!bookings_time_slot_id_fkey(*),
      user:profiles!bookings_user_id_fkey(id, full_name, email)
    `
    )
    .order("booking_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];
  return data as unknown as BookingWithRelations[];
};

const getById = async (id: string): Promise<BookingWithRelations> => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      time_slot:time_slots!bookings_time_slot_id_fkey(*),
      user:profiles!bookings_user_id_fkey(id, full_name, email)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as unknown as BookingWithRelations;
};

const create = async (
  booking: BookingInsert
): Promise<BookingWithRelations> => {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select(
      `
      *,
      time_slot:time_slots!bookings_time_slot_id_fkey(*),
      user:profiles!bookings_user_id_fkey(id, full_name, email)
    `
    )
    .single();

  if (error) throw error;
  return data as unknown as BookingWithRelations;
};

const update = async (
  id: string,
  updates: BookingUpdate
): Promise<BookingWithRelations> => {
  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select(
      `
      *,
      time_slot:time_slots!bookings_time_slot_id_fkey(*),
      user:profiles!bookings_user_id_fkey(id, full_name, email)
    `
    )
    .single();

  if (error) throw error;
  return data as unknown as BookingWithRelations;
};

const _delete = async (id: string): Promise<void> => {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) throw error;
};

// Custom specialized methods
const getByUserId = async (userId: string, limit?: number) => {
  let query = supabase
    .from("bookings")
    .select(
      `
      *,
      time_slot:time_slots!bookings_time_slot_id_fkey(*)
    `
    )
    .eq("user_id", userId)
    .order("booking_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as unknown as BookingWithRelations[];
};

const getUpcomingByUserId = async (userId: string, limit: number = 10) => {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      time_slot:time_slots!bookings_time_slot_id_fkey(*)
    `
    )
    .eq("user_id", userId)
    .eq("status", "confirmed")
    .gte("booking_date", today)
    .order("booking_date", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data as unknown as BookingWithRelations[];
};

const getByDateRange = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      time_slot:time_slots!bookings_time_slot_id_fkey(*)
    `
    )
    .gte("booking_date", startDate)
    .lte("booking_date", endDate)
    .order("booking_date", { ascending: true });

  if (error) throw error;
  return data as unknown as BookingWithRelations[];
};

const getBookingsByDate = async (date: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      time_slot:time_slots!bookings_time_slot_id_fkey(*),
      user:profiles!bookings_user_id_fkey(id, full_name, email)
    `
    )
    .eq("booking_date", date)
    .eq("status", "confirmed");

  if (error) throw error;
  return data as unknown as BookingWithRelations[];
};

const checkBookingConflict = async (
  userId: string,
  timeSlotId: string,
  bookingDate: string
) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("user_id", userId)
    .eq("time_slot_id", timeSlotId)
    .eq("booking_date", bookingDate)
    .eq("status", "confirmed")
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data !== null;
};

export const bookingService: CrudService<
  BookingWithRelations,
  BookingInsert,
  BookingUpdate
> & {
  getById: typeof getById;
  getByUserId: typeof getByUserId;
  getUpcomingByUserId: typeof getUpcomingByUserId;
  getByDateRange: typeof getByDateRange;
  getBookingsByDate: typeof getBookingsByDate;
  checkBookingConflict: typeof checkBookingConflict;
} = {
  getAll,
  create,
  update,
  delete: _delete,
  getById,
  getByUserId,
  getUpcomingByUserId,
  getByDateRange,
  getBookingsByDate,
  checkBookingConflict,
};
