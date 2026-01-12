import { StatCard } from "./StatCard";
import { Scale, Activity, Bone, Droplets, Calculator, Flame, Calendar } from "lucide-react";

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
    percentage: percentage !== undefined ? `${percentage.toFixed(1)}%` : undefined,
  };
};

export const MetricsOverview = ({
  metrics,
  trends,
  className,
}: MetricsOverviewProps) => {
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
          trend={formatTrend(trends?.weight?.change, trends?.weight?.percentage)}
        />

        {/* Grasa Corporal */}
        {metrics.bodyFat !== null && (
          <StatCard
            title="Grasa Corporal"
            value={metrics.bodyFat.toFixed(1)}
            unit="%"
            icon={<Activity className="size-4" />}
            trend={formatTrend(trends?.bodyFat?.change, trends?.bodyFat?.percentage)}
          />
        )}

        {/* Masa Muscular */}
        {metrics.muscleMass !== null && (
          <StatCard
            title="Masa Muscular"
            value={metrics.muscleMass.toFixed(1)}
            unit="kg"
            icon={<Activity className="size-4" />}
            trend={formatTrend(trends?.muscleMass?.change, trends?.muscleMass?.percentage)}
          />
        )}

        {/* Masa Ósea */}
        {metrics.boneMass !== null && (
          <StatCard
            title="Masa Ósea"
            value={metrics.boneMass.toFixed(2)}
            unit="kg"
            icon={<Bone className="size-4" />}
            trend={formatTrend(trends?.boneMass?.change, trends?.boneMass?.percentage)}
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
            trend={formatTrend(trends?.calories?.change, trends?.calories?.percentage)}
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
    </div>
  );
};
