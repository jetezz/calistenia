import { useEffect, useMemo, useCallback } from "react";
import { useWeightStatsStore, type TimeRange } from "@/stores/weightStatsStore";
import { useProfile } from "@/features/auth";

/**
 * Hook principal para la lógica de la página de Weight Stats
 * Maneja la carga de datos, filtrado y estado general
 */
export const useWeightStatsLogic = () => {
  const { profile } = useProfile();
  const userId = profile?.id;

  const {
    items: allStats,
    filteredItems: stats,
    latestStat,
    selectedTimeRange,
    isLoading,
    isLoadingLatest,
    error,
    isInitialized,
    fetchByUserId,
    fetchLatest,
    setTimeRange,
  } = useWeightStatsStore();

  // Cargar datos iniciales
  useEffect(() => {
    if (userId && !isInitialized) {
      fetchByUserId(userId);
      fetchLatest(userId);
    }
  }, [userId, isInitialized, fetchByUserId, fetchLatest]);

  // Estadísticas calculadas
  const statsCount = useMemo(() => allStats.length, [allStats]);

  const hasData = useMemo(() => statsCount > 0, [statsCount]);

  // Obtener primera y última medición para comparación
  const firstStat = useMemo(() => {
    if (stats.length === 0) return null;
    return stats[stats.length - 1];
  }, [stats]);

  const lastStat = useMemo(() => {
    if (stats.length === 0) return null;
    return stats[0];
  }, [stats]);

  // Calcular cambios (peso, grasa, músculo)
  const weightChange = useMemo(() => {
    if (!firstStat || !lastStat) return null;
    const change = lastStat.weight - firstStat.weight;
    const percentage = ((change / firstStat.weight) * 100).toFixed(1);
    return {
      value: change.toFixed(2),
      percentage,
      isPositive: change >= 0,
    };
  }, [firstStat, lastStat]);

  const bodyFatChange = useMemo(() => {
    if (
      !firstStat ||
      !lastStat ||
      !firstStat.body_fat_percentage ||
      !lastStat.body_fat_percentage
    )
      return null;
    const change = lastStat.body_fat_percentage - firstStat.body_fat_percentage;
    return {
      value: change.toFixed(2),
      isPositive: change >= 0,
    };
  }, [firstStat, lastStat]);

  const muscleMassChange = useMemo(() => {
    if (!firstStat || !lastStat || !firstStat.muscle_mass || !lastStat.muscle_mass)
      return null;
    const change = lastStat.muscle_mass - firstStat.muscle_mass;
    const percentage = ((change / firstStat.muscle_mass) * 100).toFixed(1);
    return {
      value: change.toFixed(2),
      percentage,
      isPositive: change >= 0,
    };
  }, [firstStat, lastStat]);

  // Handlers
  const handleTimeRangeChange = useCallback(
    (range: TimeRange) => {
      setTimeRange(range);
    },
    [setTimeRange]
  );

  const refreshData = useCallback(async () => {
    if (!userId) return;
    await Promise.all([fetchByUserId(userId, true), fetchLatest(userId, true)]);
  }, [userId, fetchByUserId, fetchLatest]);

  return {
    // Data
    stats,
    allStats,
    latestStat,
    firstStat,
    lastStat,
    statsCount,
    hasData,

    // Calculated changes
    weightChange,
    bodyFatChange,
    muscleMassChange,

    // Time range
    selectedTimeRange,
    handleTimeRangeChange,

    // Loading & error states
    isLoading,
    isLoadingLatest,
    error,

    // Actions
    refreshData,

    // User
    userId,
  };
};
