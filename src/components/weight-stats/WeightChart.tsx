import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { WeightStats } from "@/services/weightStatsService";
import type { IdealStats } from "@/utils/biometricsCalculators";
import { useMemo } from "react";

interface WeightChartProps {
  data: WeightStats[];
  recommendations?: IdealStats;
}

export const WeightChart = ({ data, recommendations }: WeightChartProps) => {
  const chartData = useMemo(() => {
    return data
      .map((stat) => ({
        ...stat,
        formattedDate: format(new Date(stat.recorded_at), "d MMM", {
          locale: es,
        }),
        fullDate: format(new Date(stat.recorded_at), "PPPP", { locale: es }),
      }))
      .reverse(); // Recharts expects chronological order (oldest first)
  }, [data]);

  if (chartData.length === 0) return null;

  // Calculate dynamic domain for Y axis to make the chart look good
  const weights = chartData.map((d) => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const padding = (maxWeight - minWeight) * 0.1; // 10% padding

  // Include ideal weight in domain if present
  let domainMin = minWeight - padding;
  let domainMax = maxWeight + padding;

  if (recommendations) {
    domainMin = Math.min(domainMin, recommendations.weight.min - 1);
    domainMax = Math.max(domainMax, recommendations.weight.max + 1);
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            {recommendations && (
              <linearGradient id="idealZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="formattedDate"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            minTickGap={30}
          />
          <YAxis
            domain={[Math.floor(domainMin), Math.ceil(domainMax)]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            unit="kg"
            width={40}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{
              color: "#374151",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
            formatter={(value: any) => [`${value} kg`, "Peso"]}
            labelFormatter={(label) => label} // formattedDate is used as key but we might want full date in tooltip if we passed it
          />

          {/* Reference Lines for Ideal Weight */}
          {recommendations && (
            <>
              <ReferenceLine
                y={recommendations.weight.ideal}
                stroke="#22c55e"
                strokeDasharray="3 3"
                label={{
                  position: "right",
                  value: "Ideal",
                  fill: "#22c55e",
                  fontSize: 10,
                }}
              />
              {/* Could add a shaded area for min/max if simple AreaChart supports it seamlessly mixed with data, 
                   but usually ReferenceArea is better or just lines. Let's stick to simplest first.*/}
            </>
          )}

          <Area
            type="monotone"
            dataKey="weight"
            stroke="#2563eb"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorWeight)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
