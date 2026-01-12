import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import type { CrudService } from "@/stores/BaseStore";

// Types from database
export type WeightStats = Database["public"]["Tables"]["weight_stats"]["Row"];
export type WeightStatsInsert = Database["public"]["Tables"]["weight_stats"]["Insert"];
export type WeightStatsUpdate = Database["public"]["Tables"]["weight_stats"]["Update"];

// =====================================================
// CRUD BÁSICO
// =====================================================

const getAll = async (): Promise<WeightStats[]> => {
  const { data, error } = await supabase
    .from("weight_stats")
    .select("*")
    .order("recorded_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

// getById no es necesario para weight stats - se usa getByUserId

const create = async (stats: WeightStatsInsert): Promise<WeightStats> => {
  const { data, error } = await supabase
    .from("weight_stats")
    .insert(stats)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const update = async (id: string, updates: WeightStatsUpdate): Promise<WeightStats> => {
  const { data, error } = await supabase
    .from("weight_stats")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const _delete = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("weight_stats")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

// =====================================================
// MÉTODOS ESPECÍFICOS
// =====================================================

/**
 * Obtiene todas las estadísticas de peso de un usuario específico
 */
const getByUserId = async (userId: string): Promise<WeightStats[]> => {
  const { data, error } = await supabase
    .from("weight_stats")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

/**
 * Obtiene la última medición de un usuario
 */
const getLatestByUserId = async (userId: string): Promise<WeightStats | null> => {
  const { data, error } = await supabase
    .from("weight_stats")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
};

/**
 * Obtiene estadísticas de peso en un rango de fechas
 */
const getByDateRange = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<WeightStats[]> => {
  const { data, error } = await supabase
    .from("weight_stats")
    .select("*")
    .eq("user_id", userId)
    .gte("recorded_at", startDate)
    .lte("recorded_at", endDate)
    .order("recorded_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

/**
 * Obtiene las últimas N mediciones de un usuario
 */
const getRecentByUserId = async (userId: string, limit = 10): Promise<WeightStats[]> => {
  const { data, error } = await supabase
    .from("weight_stats")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
};

/**
 * Cuenta el número total de mediciones de un usuario
 */
const countByUserId = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("weight_stats")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw error;
  return count ?? 0;
};

/**
 * Elimina todas las estadísticas de un usuario (útil para testing/admin)
 */
const deleteAllByUserId = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from("weight_stats")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
};

/**
 * Obtiene el rango de fechas de las mediciones de un usuario
 */
const getDateRangeByUserId = async (userId: string): Promise<{
  earliest: string | null;
  latest: string | null;
}> => {
  const { data, error } = await supabase
    .from("weight_stats")
    .select("recorded_at")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: true })
    .limit(1);

  if (error) throw error;

  const earliest = data?.[0]?.recorded_at ?? null;

  const { data: latestData, error: latestError } = await supabase
    .from("weight_stats")
    .select("recorded_at")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })
    .limit(1);

  if (latestError) throw latestError;

  const latest = latestData?.[0]?.recorded_at ?? null;

  return { earliest, latest };
};

// =====================================================
// HELPER FUNCTIONS USANDO RPC (FUNCIONES SQL)
// =====================================================

/**
 * Usa la función SQL para obtener la última medición (más eficiente)
 */
const getLatestByUserIdRpc = async (userId: string): Promise<WeightStats | null> => {
  const { data, error } = await supabase
    .rpc("get_latest_weight_stat", { p_user_id: userId })
    .maybeSingle();

  if (error) throw error;
  return data;
};

/**
 * Usa la función SQL para obtener estadísticas en un rango de fechas
 */
const getByDateRangeRpc = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<WeightStats[]> => {
  const { data, error } = await supabase.rpc("get_weight_stats_by_date_range", {
    p_user_id: userId,
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) throw error;
  return data ?? [];
};

/**
 * Calcula el cambio de peso entre dos fechas usando la función SQL
 */
const calculateWeightChange = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<{
  weight_change: number | null;
  percentage_change: number | null;
  start_weight: number | null;
  end_weight: number | null;
} | null> => {
  const { data, error } = await supabase
    .rpc("calculate_weight_change", {
      p_user_id: userId,
      p_start_date: startDate,
      p_end_date: endDate,
    })
    .maybeSingle();

  if (error) throw error;
  return data;
};

// =====================================================
// EXPORTACIÓN DEL SERVICIO
// =====================================================

export const weightStatsService: CrudService<
  WeightStats,
  WeightStatsInsert,
  WeightStatsUpdate
> & {
  getByUserId: typeof getByUserId;
  getLatestByUserId: typeof getLatestByUserId;
  getByDateRange: typeof getByDateRange;
  getRecentByUserId: typeof getRecentByUserId;
  countByUserId: typeof countByUserId;
  deleteAllByUserId: typeof deleteAllByUserId;
  getDateRangeByUserId: typeof getDateRangeByUserId;
  getLatestByUserIdRpc: typeof getLatestByUserIdRpc;
  getByDateRangeRpc: typeof getByDateRangeRpc;
  calculateWeightChange: typeof calculateWeightChange;
} = {
  // CRUD básico
  getAll,
  create,
  update,
  delete: _delete,

  // Métodos específicos
  getByUserId,
  getLatestByUserId,
  getByDateRange,
  getRecentByUserId,
  countByUserId,
  deleteAllByUserId,
  getDateRangeByUserId,

  // RPC methods (usando funciones SQL)
  getLatestByUserIdRpc,
  getByDateRangeRpc,
  calculateWeightChange,
};
