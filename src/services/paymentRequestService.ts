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
  // 1. Obtener la solicitud para saber cuántos créditos sumar
  const request = await getById(id);
  if (!request) throw new Error("Solicitud no encontrada");
  if (request.status !== "pending")
    throw new Error("La solicitud ya fue procesada");

  // 2. Actualizar el estado de la solicitud
  const updates: PaymentRequestUpdate = {
    status: "approved",
    processed_by: processedBy,
    processed_at: new Date().toISOString(),
    admin_notes: adminNotes,
  };

  // Realizamos la actualización de la solicitud primero
  const updatedRequest = await update(id, updates);

  // 3. Sumar los créditos al usuario y actualizar estado de pago
  if (request.user_id && request.credits_requested) {
    // Obtenemos el perfil actual para sumar correctamente
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", request.user_id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      // No lanzamos error aquí para no romper el flujo si la solicitud ya se marcó aprobada,
      // pero idealmente deberíamos manejar esto mejor (transacción).
    } else {
      const currentCredits = profile?.credits || 0;
      const newCredits = currentCredits + request.credits_requested;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          credits: newCredits,
          payment_status: "paid", // Actualizamos status a pagado
        })
        .eq("id", request.user_id);

      if (updateError) {
        console.error("Error updating credits:", updateError);
        // Aquí queda un estado inconsistente si falla.
        // TODO: Mover a RPC para atomicidad.
      }
    }
  }

  return updatedRequest;
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
