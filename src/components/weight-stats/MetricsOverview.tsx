import { useState } from "react";
import { StatCard } from "./StatCard";
import { ScientificInfoModal, type MetricType } from "./ScientificInfoModal";
import {
  Scale,
  Activity,
  Bone,
  Droplets,
  Calculator,
  Flame,
  Calendar,
} from "lucide-react";
import type { IdealStats } from "@/utils/biometricsCalculators";
import { useProfile } from "@/features/auth";
import type { PhysicalObjective } from "@/utils/biometricsCalculators";

interface TrendData {
  value: string;
  isPositive: boolean;
  percentage?: string;
}

interface Metrics {
  weight: number;
  bodyFat: number | null;
  muscleMass: number | null;
  boneMass: number | null;
  bmi: number | null;
  calories: number | null;
  metabolicAge: number | null;
  waterPercentage: number | null;
  date: string;
}

interface Trends {
  weight: { change: number; percentage: number } | null;
  bodyFat: { change: number; percentage: number } | null;
  muscleMass: { change: number; percentage: number } | null;
  boneMass: { change: number; percentage: number } | null;
  bmi: { change: number; percentage: number } | null;
  waterPercentage: { change: number; percentage: number } | null;
  calories: { change: number; percentage: number } | null;
  metabolicAge: { change: number } | null;
}

interface MetricsOverviewProps {
  metrics: Metrics;
  trends: Trends | null;
  recommendations?: IdealStats | null; // Added
  className?: string;
}

// Helper para formatear tendencia
const formatTrend = (
  change: number | undefined,
  percentage?: number
): TrendData | undefined => {
  if (change === undefined || change === null) return undefined;

  return {
    value: change.toFixed(2),
    isPositive: change >= 0,
    percentage:
      percentage !== undefined ? `${percentage.toFixed(1)}%` : undefined,
  };
};

export const MetricsOverview = ({
  metrics,
  trends,
  recommendations,
  className,
}: MetricsOverviewProps) => {
  const { profile } = useProfile();
  const [selectedInfo, setSelectedInfo] = useState<MetricType | null>(null);

  // Helper for recommendation status
  const getStatus = (
    val: number,
    min: number,
    max: number
  ): "good" | "warning" | "alert" => {
    if (val >= min && val <= max) return "good";
    if (val < min * 0.9 || val > max * 1.1) return "alert";
    return "warning";
  };

  const currentObjective = (profile?.physical_objective ||
    "health") as PhysicalObjective;

  return (
    <div className={className}>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Última medición: {metrics.date}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Peso */}
        <StatCard
          title="Peso"
          value={metrics.weight.toFixed(1)}
          unit="kg"
          icon={<Scale className="size-4" />}
          trend={formatTrend(
            trends?.weight?.change,
            trends?.weight?.percentage
          )}
          recommendation={
            recommendations
              ? {
                  target: recommendations.weight.ideal,
                  label: `Ideal: ${recommendations.weight.min} - ${recommendations.weight.max} kg`,
                  status: getStatus(
                    metrics.weight,
                    recommendations.weight.min,
                    recommendations.weight.max
                  ),
                }
              : undefined
          }
          onClick={() => setSelectedInfo("weight")}
        />

        {/* Grasa Corporal */}
        {metrics.bodyFat !== null && (
          <StatCard
            title="Grasa Corporal"
            value={metrics.bodyFat.toFixed(1)}
            unit="%"
            icon={<Activity className="size-4" />}
            trend={formatTrend(
              trends?.bodyFat?.change,
              trends?.bodyFat?.percentage
            )}
            recommendation={
              recommendations
                ? {
                    target: ``,
                    label: `Ideal: ${recommendations.bodyFat.min}% - ${recommendations.bodyFat.max}%`,
                    status: getStatus(
                      metrics.bodyFat,
                      recommendations.bodyFat.min,
                      recommendations.bodyFat.max
                    ),
                  }
                : undefined
            }
            onClick={() => setSelectedInfo("bodyFat")}
          />
        )}

        {/* Masa Muscular */}
        {metrics.muscleMass !== null && (
          <StatCard
            title="Masa Muscular"
            value={metrics.muscleMass.toFixed(1)}
            unit="kg"
            icon={<Activity className="size-4" />}
            trend={formatTrend(
              trends?.muscleMass?.change,
              trends?.muscleMass?.percentage
            )}
            recommendation={
              recommendations
                ? {
                    target: ``,
                    label: `Meta: ${recommendations.muscleMass.min} - ${recommendations.muscleMass.max} kg`,
                    status: getStatus(
                      metrics.muscleMass,
                      recommendations.muscleMass.min,
                      recommendations.muscleMass.max
                    ),
                  }
                : undefined
            }
            onClick={() => setSelectedInfo("muscleMass")}
          />
        )}

        {/* Masa Ósea */}
        {metrics.boneMass !== null && (
          <StatCard
            title="Masa Ósea"
            value={metrics.boneMass.toFixed(2)}
            unit="kg"
            icon={<Bone className="size-4" />}
            trend={formatTrend(
              trends?.boneMass?.change,
              trends?.boneMass?.percentage
            )}
          />
        )}

        {/* IMC */}
        {metrics.bmi !== null && (
          <StatCard
            title="IMC"
            value={metrics.bmi.toFixed(1)}
            unit=""
            icon={<Calculator className="size-4" />}
            trend={formatTrend(trends?.bmi?.change, trends?.bmi?.percentage)}
            recommendation={
              recommendations
                ? {
                    target: ``,
                    label: `Ideal: ${recommendations.bmi.min} - ${recommendations.bmi.max}`,
                    status: getStatus(
                      metrics.bmi,
                      recommendations.bmi.min,
                      recommendations.bmi.max
                    ),
                  }
                : undefined
            }
            onClick={() => setSelectedInfo("bmi")}
          />
        )}

        {/* Agua Corporal */}
        {metrics.waterPercentage !== null && (
          <StatCard
            title="Agua Corporal"
            value={metrics.waterPercentage.toFixed(1)}
            unit="%"
            icon={<Droplets className="size-4" />}
            trend={formatTrend(
              trends?.waterPercentage?.change,
              trends?.waterPercentage?.percentage
            )}
          />
        )}

        {/* Calorías Diarias */}
        {metrics.calories !== null && (
          <StatCard
            title="Calorías Diarias"
            value={metrics.calories}
            unit="kcal"
            icon={<Flame className="size-4" />}
            trend={formatTrend(
              trends?.calories?.change,
              trends?.calories?.percentage
            )}
          />
        )}

        {/* Edad Metabólica */}
        {metrics.metabolicAge !== null && (
          <StatCard
            title="Edad Metabólica"
            value={metrics.metabolicAge}
            unit="años"
            icon={<Calendar className="size-4" />}
            trend={formatTrend(trends?.metabolicAge?.change)}
          />
        )}
      </div>

      {selectedInfo && (
        <ScientificInfoModal
          isOpen={!!selectedInfo}
          onClose={() => setSelectedInfo(null)}
          metric={selectedInfo}
          objective={currentObjective}
        />
      )}
    </div>
  );
};
