import { create } from "zustand";
import { createBaseStore, type BaseStoreState } from "./BaseStore";
import { weightStatsService } from "@/services/weightStatsService";
import type { WeightStats, WeightStatsInsert, WeightStatsUpdate } from "@/services/weightStatsService";

// =====================================================
// TIPOS ADICIONALES
// =====================================================

export type TimeRange = "7d" | "1m" | "3m" | "6m" | "1y" | "all";

export interface DateRange {
  start: string;
  end: string;
}

export interface WeightChangeData {
  weight_change: number | null;
  percentage_change: number | null;
  start_weight: number | null;
  end_weight: number | null;
}

// =====================================================
// INTERFACE DEL STORE
// =====================================================

interface WeightStatsStore
  extends BaseStoreState<WeightStats, WeightStatsInsert, WeightStatsUpdate> {
  // Estado adicional
  currentUserId: string | null;
  latestStat: WeightStats | null;
  selectedTimeRange: TimeRange;
  filteredItems: WeightStats[];
  isLoadingLatest: boolean;

  // Métodos para filtrado temporal
  setTimeRange: (range: TimeRange) => void;
  applyTimeRangeFilter: () => void;

  // Métodos específicos para usuario
  fetchByUserId: (userId: string, force?: boolean) => Promise<void>;
  fetchLatest: (userId: string, force?: boolean) => Promise<void>;
  fetchByDateRange: (userId: string, startDate: string, endDate: string) => Promise<void>;
  fetchRecent: (userId: string, limit?: number) => Promise<void>;

  // Métodos de análisis
  calculateChange: (
    userId: string,
    startDate: string,
    endDate: string
  ) => Promise<WeightChangeData | null>;
  getCount: (userId: string) => Promise<number>;
  getDateRange: (userId: string) => Promise<{ earliest: string | null; latest: string | null }>;

  // Helper methods
  setCurrentUserId: (userId: string | null) => void;
  clearUserData: () => void;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Calcula la fecha de inicio basándose en el rango de tiempo seleccionado
 */
const getStartDateFromTimeRange = (range: TimeRange): string => {
  const now = new Date();
  const start = new Date();

  switch (range) {
    case "7d":
      start.setDate(now.getDate() - 7);
      break;
    case "1m":
      start.setMonth(now.getMonth() - 1);
      break;
    case "3m":
      start.setMonth(now.getMonth() - 3);
      break;
    case "6m":
      start.setMonth(now.getMonth() - 6);
      break;
    case "1y":
      start.setFullYear(now.getFullYear() - 1);
      break;
    case "all":
      start.setFullYear(2000); // Fecha muy antigua para incluir todo
      break;
  }

  return start.toISOString();
};

/**
 * Filtra items por rango de tiempo
 */
const filterItemsByTimeRange = (items: WeightStats[], range: TimeRange): WeightStats[] => {
  if (range === "all") return items;

  const startDate = getStartDateFromTimeRange(range);
  return items.filter((item) => new Date(item.recorded_at) >= new Date(startDate));
};

// =====================================================
// STORE IMPLEMENTATION
// =====================================================

export const useWeightStatsStore = create<WeightStatsStore>((set, get, store) => {
  const baseStore = createBaseStore<WeightStats, WeightStatsInsert, WeightStatsUpdate>(
    weightStatsService
  )(set, get, store);

  return {
    ...baseStore,

    // Estado adicional
    currentUserId: null,
    latestStat: null,
    selectedTimeRange: "1m",
    filteredItems: [],
    isLoadingLatest: false,

    // =====================================================
    // FILTRADO TEMPORAL
    // =====================================================

    setTimeRange: (range: TimeRange) => {
      set({ selectedTimeRange: range });
      get().applyTimeRangeFilter();
    },

    applyTimeRangeFilter: () => {
      const { items, selectedTimeRange } = get();
      const filtered = filterItemsByTimeRange(items, selectedTimeRange);
      set({ filteredItems: filtered });
    },

    // =====================================================
    // MÉTODOS ESPECÍFICOS PARA USUARIO
    // =====================================================

    fetchByUserId: async (userId: string, force = false) => {
      const { isLoading, isInitialized } = get();

      // Evitar llamadas duplicadas
      if (!force && (isLoading || isInitialized)) return;

      set({ isLoading: true, error: null, currentUserId: userId });

      try {
        const data = await weightStatsService.getByUserId(userId);
        set({
          items: data,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
        get().applyTimeRangeFilter();
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({
          error: error.message,
          isLoading: false,
          items: [],
        });
      }
    },

    fetchLatest: async (userId: string, force = false) => {
      const { isLoadingLatest } = get();

      if (!force && isLoadingLatest) return;

      set({ isLoadingLatest: true, error: null });

      try {
        const data = await weightStatsService.getLatestByUserId(userId);
        set({
          latestStat: data,
          isLoadingLatest: false,
          error: null,
        });
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({
          error: error.message,
          isLoadingLatest: false,
          latestStat: null,
        });
      }
    },

    fetchByDateRange: async (userId: string, startDate: string, endDate: string) => {
      set({ isLoading: true, error: null });

      try {
        const data = await weightStatsService.getByDateRange(userId, startDate, endDate);
        set({
          items: data,
          isLoading: false,
          error: null,
        });
        get().applyTimeRangeFilter();
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({
          error: error.message,
          isLoading: false,
          items: [],
        });
      }
    },

    fetchRecent: async (userId: string, limit = 10) => {
      set({ isLoading: true, error: null });

      try {
        const data = await weightStatsService.getRecentByUserId(userId, limit);
        set({
          items: data,
          isLoading: false,
          error: null,
        });
        get().applyTimeRangeFilter();
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({
          error: error.message,
          isLoading: false,
          items: [],
        });
      }
    },

    // =====================================================
    // MÉTODOS DE ANÁLISIS
    // =====================================================

    calculateChange: async (
      userId: string,
      startDate: string,
      endDate: string
    ): Promise<WeightChangeData | null> => {
      try {
        const data = await weightStatsService.calculateWeightChange(userId, startDate, endDate);
        return data;
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message });
        return null;
      }
    },

    getCount: async (userId: string): Promise<number> => {
      try {
        const count = await weightStatsService.countByUserId(userId);
        return count;
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message });
        return 0;
      }
    },

    getDateRange: async (
      userId: string
    ): Promise<{ earliest: string | null; latest: string | null }> => {
      try {
        const range = await weightStatsService.getDateRangeByUserId(userId);
        return range;
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message });
        return { earliest: null, latest: null };
      }
    },

    // =====================================================
    // OVERRIDE CREATE (con optimistic update mejorado)
    // =====================================================

    create: async (data: WeightStatsInsert) => {
      const tempId = crypto.randomUUID();
      const tempItem: WeightStats = {
        id: tempId,
        user_id: data.user_id,
        weight: data.weight,
        body_fat_percentage: data.body_fat_percentage ?? null,
        muscle_mass: data.muscle_mass ?? null,
        bone_mass: data.bone_mass ?? null,
        bmi: data.bmi ?? null,
        daily_calorie_intake: data.daily_calorie_intake ?? null,
        metabolic_age: data.metabolic_age ?? null,
        total_body_water_percentage: data.total_body_water_percentage ?? null,
        recorded_at: data.recorded_at ?? new Date().toISOString(),
        notes: data.notes ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Optimistic update
      set((state) => ({
        items: [tempItem, ...state.items],
        latestStat: tempItem, // Actualizar también la última medición
      }));
      get().applyTimeRangeFilter();

      try {
        const newItem = await weightStatsService.create(data);

        // Reemplazar el item temporal con el real
        set((state) => ({
          items: state.items.map((item) => (item.id === tempId ? newItem : item)),
          latestStat: newItem,
          error: null,
        }));
        get().applyTimeRangeFilter();
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));

        // Rollback en caso de error
        set((state) => ({
          items: state.items.filter((item) => item.id !== tempId),
          latestStat: state.items[1] ?? null, // Restaurar la segunda más reciente
          error: error.message,
        }));
        get().applyTimeRangeFilter();
        throw error;
      }
    },

    // =====================================================
    // HELPER METHODS
    // =====================================================

    setCurrentUserId: (userId: string | null) => {
      set({ currentUserId: userId });
    },

    clearUserData: () => {
      set({
        items: [],
        filteredItems: [],
        currentItem: null,
        latestStat: null,
        currentUserId: null,
        isInitialized: false,
        selectedTimeRange: "1m",
      });
    },
  };
});
