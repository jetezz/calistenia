import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import type { CrudService } from "@/stores/BaseStore";

type AppSetting = Database["public"]["Tables"]["app_settings"]["Row"];
type AppSettingInsert = Database["public"]["Tables"]["app_settings"]["Insert"];
type AppSettingUpdate = Database["public"]["Tables"]["app_settings"]["Update"];

export interface CancellationPolicy {
  unit: "hours" | "days";
  value: number;
}

const getAll = async (): Promise<AppSetting[]> => {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .order("key", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const getById = async (id: string): Promise<AppSetting> => {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

const create = async (setting: AppSettingInsert): Promise<AppSetting> => {
  const { data, error } = await supabase
    .from("app_settings")
    .insert(setting)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const update = async (
  id: string,
  updates: AppSettingUpdate
): Promise<AppSetting> => {
  const { data, error } = await supabase
    .from("app_settings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const _delete = async (id: string): Promise<void> => {
  const { error } = await supabase.from("app_settings").delete().eq("id", id);

  if (error) throw error;
};

// Métodos específicos
const getByKey = async (key: string) => {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .eq("key", key)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
};

const upsertByKey = async (key: string, value: any, userId: string) => {
  // Check if exists logic or upsert
  // Supabase upsert requires unique constraint on key if not using ID.
  // Assuming key is unique.
  const { data, error } = await supabase
    .from("app_settings")
    .upsert(
      {
        key,
        value,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const appSettingsService: CrudService<
  AppSetting,
  AppSettingInsert,
  AppSettingUpdate
> & {
  getByKey: typeof getByKey;
  upsertByKey: typeof upsertByKey;
  getById: typeof getById; // Required by interface if we forced strict compliance but CrudService uses generics.
} = {
  getAll,
  create,
  update,
  delete: _delete,
  getByKey,
  upsertByKey,
  getById,
};
