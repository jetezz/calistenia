import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import type { CrudService } from "@/stores/BaseStore";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

const getAll = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

const getById = async (id: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

const create = async (profile: ProfileInsert): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const update = async (id: string, updates: ProfileUpdate): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const _delete = async (id: string): Promise<void> => {
  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) throw error;
};

// Métodos específicos
const getByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data;
};

const updateCredits = async (id: string, credits: number) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ credits })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updatePaymentStatus = async (id: string, paymentStatus: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ payment_status: paymentStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const createUser = async (
  email: string,
  password: string,
  fullName: string
) => {
  const { data, error } = await supabase.rpc("admin_create_user", {
    p_email: email,
    p_password: password,
    p_full_name: fullName,
  });

  if (error) throw error;
  return data;
};

const deleteUser = async (userId: string) => {
  const { data, error } = await supabase.rpc("admin_delete_user", {
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
};

const updateApprovalStatus = async (
  id: string,
  approvalStatus: "pending" | "approved" | "rejected"
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ approval_status: approvalStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const approveUser = async (userId: string) => {
  const { data, error } = await supabase.rpc("approve_user", {
    target_user_id: userId,
  });

  if (error) throw error;
  return data;
};

const rejectUser = async (userId: string) => {
  const { data, error } = await supabase.rpc("reject_user", {
    target_user_id: userId,
  });

  if (error) throw error;
  return data;
};

export const profileService: CrudService<
  Profile,
  ProfileInsert,
  ProfileUpdate
> & {
  getById: typeof getById;
  getByEmail: typeof getByEmail;
  updateCredits: typeof updateCredits;
  updatePaymentStatus: typeof updatePaymentStatus;
  createUser: typeof createUser;
  deleteUser: typeof deleteUser;
  updateApprovalStatus: typeof updateApprovalStatus;
  approveUser: typeof approveUser;
  rejectUser: typeof rejectUser;
} = {
  getAll,
  create,
  update,
  delete: _delete, // Usamos _delete para evitar conflicto con palabra reservada
  getById,
  getByEmail,
  updateCredits,
  updatePaymentStatus,
  createUser,
  deleteUser,
  updateApprovalStatus,
  approveUser,
  rejectUser,
};
