import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import type { CrudService } from "@/stores/BaseStore";

type PaymentRequest = Database["public"]["Tables"]["payment_requests"]["Row"];
type PaymentRequestInsert =
  Database["public"]["Tables"]["payment_requests"]["Insert"];
type PaymentRequestUpdate =
  Database["public"]["Tables"]["payment_requests"]["Update"];

type PaymentRequestWithRelations = PaymentRequest & {
  user: { id: string; full_name: string | null; email: string } | null;
};

const getAll = async (): Promise<PaymentRequestWithRelations[]> => {
  const { data, error } = await supabase
    .from("payment_requests")
    .select(
      `
      *,
      user:profiles!payment_requests_user_id_fkey(id, full_name, email)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as PaymentRequestWithRelations[];
};

const getById = async (id: string): Promise<PaymentRequestWithRelations> => {
  const { data, error } = await supabase
    .from("payment_requests")
    .select(
      `
      *,
      user:profiles!payment_requests_user_id_fkey(id, full_name, email)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as unknown as PaymentRequestWithRelations;
};

const create = async (
  paymentRequest: PaymentRequestInsert
): Promise<PaymentRequestWithRelations> => {
  const { data, error } = await supabase
    .from("payment_requests")
    .insert(paymentRequest)
    .select(
      `
      *,
      user:profiles!payment_requests_user_id_fkey(id, full_name, email)
    `
    )
    .single();

  if (error) throw error;
  return data as unknown as PaymentRequestWithRelations;
};

const update = async (
  id: string,
  updates: PaymentRequestUpdate
): Promise<PaymentRequestWithRelations> => {
  const { data, error } = await supabase
    .from("payment_requests")
    .update(updates)
    .eq("id", id)
    .select(
      `
      *,
      user:profiles!payment_requests_user_id_fkey(id, full_name, email)
    `
    )
    .single();

  if (error) throw error;
  return data as unknown as PaymentRequestWithRelations;
};

const _delete = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("payment_requests")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

// Métodos específicos
const getByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

const getByStatus = async (status: string) => {
  const { data, error } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

const getPending = async () => {
  const { data, error } = await supabase
    .from("payment_requests")
    .select(
      `
      *,
      user:profiles!payment_requests_user_id_fkey(id, full_name, email)
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as unknown as PaymentRequestWithRelations[];
};

const approve = async (
  id: string,
  processedBy: string,
  adminNotes?: string
) => {
  const updates: PaymentRequestUpdate = {
    status: "approved",
    processed_by: processedBy,
    processed_at: new Date().toISOString(),
    admin_notes: adminNotes,
  };
  return update(id, updates);
};

const reject = async (id: string, processedBy: string, adminNotes?: string) => {
  const updates: PaymentRequestUpdate = {
    status: "rejected",
    processed_by: processedBy,
    processed_at: new Date().toISOString(),
    admin_notes: adminNotes,
  };
  return update(id, updates);
};

export const paymentRequestService: CrudService<
  PaymentRequestWithRelations,
  PaymentRequestInsert,
  PaymentRequestUpdate
> & {
  getById: typeof getById;
  getByUserId: typeof getByUserId;
  getByStatus: typeof getByStatus;
  getPending: typeof getPending;
  approve: typeof approve;
  reject: typeof reject;
} = {
  getAll,
  create,
  update,
  delete: _delete,
  getById,
  getByUserId,
  getByStatus,
  getPending,
  approve,
  reject,
};
