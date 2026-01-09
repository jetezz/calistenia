import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import type { CrudService } from "@/stores/BaseStore";

type PricingPackage = Database["public"]["Tables"]["pricing_packages"]["Row"];
type PricingPackageInsert =
  Database["public"]["Tables"]["pricing_packages"]["Insert"];
type PricingPackageUpdate =
  Database["public"]["Tables"]["pricing_packages"]["Update"];

const getAll = async (): Promise<PricingPackage[]> => {
  const { data, error } = await supabase
    .from("pricing_packages")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const getById = async (id: string): Promise<PricingPackage> => {
  const { data, error } = await supabase
    .from("pricing_packages")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

const create = async (
  pricingPackage: PricingPackageInsert
): Promise<PricingPackage> => {
  const { data, error } = await supabase
    .from("pricing_packages")
    .insert(pricingPackage)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const update = async (
  id: string,
  updates: PricingPackageUpdate
): Promise<PricingPackage> => {
  const { data, error } = await supabase
    .from("pricing_packages")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const _delete = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("pricing_packages")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

// Métodos específicos
const getActive = async () => {
  const { data, error } = await supabase
    .from("pricing_packages")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const updateDisplayOrder = async (packageId: string, newOrder: number) => {
  return update(packageId, { display_order: newOrder });
};

const toggleActive = async (id: string, isActive: boolean) => {
  return update(id, { is_active: isActive });
};

export const pricingPackageService: CrudService<
  PricingPackage,
  PricingPackageInsert,
  PricingPackageUpdate
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
