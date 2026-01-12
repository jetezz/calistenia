import { useMemo } from "react";
import type { WeightStats } from "@/services/weightStatsService";

/**
 * Datos formateados para Recharts - Gráfico completo con todas las métricas
 */
export interface AllMetricsChartData {
  date: string;
  weight: number;
  bodyFat: number | null;
  muscleMass: number | null;
  boneMass: number | null;
  bmi: number | null;
  waterPercentage: number | null;
  calories: number | null;
  metabolicAge: number | null;
  formattedDate: string;
}

/**
 * Datos para gráfico de peso y composición corporal (kg)
 */
export interface WeightCompositionChartData {
  date: string;
  weight: number;
  muscleMass: number | null;
  boneMass: number | null;
  formattedDate: string;
}

/**
 * Datos para gráfico de porcentajes corporales
 */
export interface BodyPercentagesChartData {
  date: string;
  bodyFat: number | null;
  waterPercentage: number | null;
  formattedDate: string;
}

/**
 * Datos para gráfico de IMC
 */
export interface BMIChartData {
  date: string;
  bmi: number | null;
  formattedDate: string;
}

/**
 * Datos para gráfico de calorías y metabolismo
 */
export interface MetabolismChartData {
  date: string;
  calories: number | null;
  metabolicAge: number | null;
  formattedDate: string;
}

/**
 * Hook para transformar datos de Weight Stats en formato para gráficos
 */
export const useWeightStatsCharts = (stats: WeightStats[]) => {
  // Formatear fecha para display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  };

  // Formatear fecha completa
  const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Datos unificados para todos los gráficos
  const allMetricsData = useMemo((): AllMetricsChartData[] => {
    return stats
      .slice()
      .reverse() // Ordenar cronológicamente
      .map((stat) => ({
        date: stat.recorded_at,
        weight: stat.weight,
        bodyFat: stat.body_fat_percentage,
        muscleMass: stat.muscle_mass,
        boneMass: stat.bone_mass,
        bmi: stat.bmi,
        waterPercentage: stat.total_body_water_percentage,
        calories: stat.daily_calorie_intake,
        metabolicAge: stat.metabolic_age,
        formattedDate: formatDate(stat.recorded_at),
      }));
  }, [stats]);

  // Métricas agregadas para el último dato disponible
  const latestMetrics = useMemo(() => {
    if (stats.length === 0) return null;

    const latest = stats[0]; // El más reciente (ya ordenado descendente)

    return {
      weight: latest.weight,
      bodyFat: latest.body_fat_percentage,
      muscleMass: latest.muscle_mass,
      boneMass: latest.bone_mass,
      bmi: latest.bmi,
      calories: latest.daily_calorie_intake,
      metabolicAge: latest.metabolic_age,
      waterPercentage: latest.total_body_water_percentage,
      date: formatFullDate(latest.recorded_at),
      notes: latest.notes,
    };
  }, [stats]);

  // Verificar si hay datos suficientes para mostrar gráficos
  const hasEnoughData = useMemo(() => stats.length >= 2, [stats]);

  // Estadísticas de tendencias (TODAS las métricas)
  const trends = useMemo(() => {
    if (stats.length < 2) return null;

    const recent = stats[0];
    const previous = stats[1];

    return {
      weight: {
        current: recent.weight,
        previous: previous.weight,
        change: recent.weight - previous.weight,
        percentage: ((recent.weight - previous.weight) / previous.weight) * 100,
      },
      bodyFat:
        recent.body_fat_percentage && previous.body_fat_percentage
          ? {
              current: recent.body_fat_percentage,
              previous: previous.body_fat_percentage,
              change: recent.body_fat_percentage - previous.body_fat_percentage,
              percentage: ((recent.body_fat_percentage - previous.body_fat_percentage) / previous.body_fat_percentage) * 100,
            }
          : null,
      muscleMass:
        recent.muscle_mass && previous.muscle_mass
          ? {
              current: recent.muscle_mass,
              previous: previous.muscle_mass,
              change: recent.muscle_mass - previous.muscle_mass,
              percentage: ((recent.muscle_mass - previous.muscle_mass) / previous.muscle_mass) * 100,
            }
          : null,
      boneMass:
        recent.bone_mass && previous.bone_mass
          ? {
              current: recent.bone_mass,
              previous: previous.bone_mass,
              change: recent.bone_mass - previous.bone_mass,
              percentage: ((recent.bone_mass - previous.bone_mass) / previous.bone_mass) * 100,
            }
          : null,
      bmi:
        recent.bmi && previous.bmi
          ? {
              current: recent.bmi,
              previous: previous.bmi,
              change: recent.bmi - previous.bmi,
              percentage: ((recent.bmi - previous.bmi) / previous.bmi) * 100,
            }
          : null,
      waterPercentage:
        recent.total_body_water_percentage && previous.total_body_water_percentage
          ? {
              current: recent.total_body_water_percentage,
              previous: previous.total_body_water_percentage,
              change: recent.total_body_water_percentage - previous.total_body_water_percentage,
              percentage: ((recent.total_body_water_percentage - previous.total_body_water_percentage) / previous.total_body_water_percentage) * 100,
            }
          : null,
      calories:
        recent.daily_calorie_intake && previous.daily_calorie_intake
          ? {
              current: recent.daily_calorie_intake,
              previous: previous.daily_calorie_intake,
              change: recent.daily_calorie_intake - previous.daily_calorie_intake,
              percentage: ((recent.daily_calorie_intake - previous.daily_calorie_intake) / previous.daily_calorie_intake) * 100,
            }
          : null,
      metabolicAge:
        recent.metabolic_age && previous.metabolic_age
          ? {
              current: recent.metabolic_age,
              previous: previous.metabolic_age,
              change: recent.metabolic_age - previous.metabolic_age,
            }
          : null,
    };
  }, [stats]);

  // Datos específicos para cada tipo de gráfico
  const weightCompositionData = useMemo((): WeightCompositionChartData[] => {
    return stats
      .slice()
      .reverse()
      .map((stat) => ({
        date: stat.recorded_at,
        weight: stat.weight,
        muscleMass: stat.muscle_mass,
        boneMass: stat.bone_mass,
        formattedDate: formatDate(stat.recorded_at),
      }));
  }, [stats]);

  const bodyPercentagesData = useMemo((): BodyPercentagesChartData[] => {
    return stats
      .slice()
      .reverse()
      .filter((stat) => stat.body_fat_percentage !== null || stat.total_body_water_percentage !== null)
      .map((stat) => ({
        date: stat.recorded_at,
        bodyFat: stat.body_fat_percentage,
        waterPercentage: stat.total_body_water_percentage,
        formattedDate: formatDate(stat.recorded_at),
      }));
  }, [stats]);

  const bmiData = useMemo((): BMIChartData[] => {
    return stats
      .slice()
      .reverse()
      .filter((stat) => stat.bmi !== null)
      .map((stat) => ({
        date: stat.recorded_at,
        bmi: stat.bmi,
        formattedDate: formatDate(stat.recorded_at),
      }));
  }, [stats]);

  const metabolismData = useMemo((): MetabolismChartData[] => {
    return stats
      .slice()
      .reverse()
      .filter((stat) => stat.daily_calorie_intake !== null || stat.metabolic_age !== null)
      .map((stat) => ({
        date: stat.recorded_at,
        calories: stat.daily_calorie_intake,
        metabolicAge: stat.metabolic_age,
        formattedDate: formatDate(stat.recorded_at),
      }));
  }, [stats]);

  return {
    // Datos unificados (mantener por compatibilidad)
    allMetricsData,

    // Datos específicos por categoría
    weightCompositionData,
    bodyPercentagesData,
    bmiData,
    metabolismData,

    // Métricas y tendencias
    latestMetrics,
    trends,

    // Helpers
    hasEnoughData,
    formatDate,
    formatFullDate,
  };
};
