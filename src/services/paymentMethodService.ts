import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import type { CrudService } from "@/stores/BaseStore";

type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];
type PaymentMethodInsert =
  Database["public"]["Tables"]["payment_methods"]["Insert"];
type PaymentMethodUpdate =
  Database["public"]["Tables"]["payment_methods"]["Update"];

const getAll = async (): Promise<PaymentMethod[]> => {
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const getById = async (id: string): Promise<PaymentMethod> => {
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

const create = async (
  paymentMethod: PaymentMethodInsert
): Promise<PaymentMethod> => {
  const { data, error } = await supabase
    .from("payment_methods")
    .insert(paymentMethod)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const update = async (
  id: string,
  updates: PaymentMethodUpdate
): Promise<PaymentMethod> => {
  const { data, error } = await supabase
    .from("payment_methods")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const _delete = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("payment_methods")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

// Métodos específicos
const getActive = async () => {
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const updateDisplayOrder = async (methodId: string, newOrder: number) => {
  return update(methodId, { display_order: newOrder });
};

const toggleActive = async (id: string, isActive: boolean) => {
  return update(id, { is_active: isActive });
};

export const paymentMethodService: CrudService<
  PaymentMethod,
  PaymentMethodInsert,
  PaymentMethodUpdate
> & {
  getById: typeof getById;
  getActive: typeof getActive;
  updateDisplayOrder: typeof updateDisplayOrder;
  toggleActive: typeof toggleActive;
} = {
  getAll,
  create,
  update,
  delete: _delete,
  getById,
  getActive,
  updateDisplayOrder,
  toggleActive,
};
