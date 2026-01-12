import {
  ComposedChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { WeightStats } from "@/services/weightStatsService";
import type { IdealStats } from "@/utils/biometricsCalculators";
import { useMemo } from "react";

interface BodyCompositionChartProps {
  data: WeightStats[];
  recommendations?: IdealStats;
}

export const BodyCompositionChart = ({
  data,
  recommendations,
}: BodyCompositionChartProps) => {
  const chartData = useMemo(() => {
    return data
      .map((stat) => ({
        ...stat,
        formattedDate: format(new Date(stat.recorded_at), "d MMM", {
          locale: es,
        }),
        fullDate: format(new Date(stat.recorded_at), "PPPP", { locale: es }),
      }))
      .reverse();
  }, [data]);

  if (chartData.length === 0) return null;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
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
          {/* Left Axis: Body Fat % */}
          <YAxis
            yAxisId="left"
            orientation="left"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#ef4444" }}
            unit="%"
            width={40}
            domain={["auto", "auto"]}
          />
          {/* Right Axis: Muscle Mass kg */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#3b82f6" }}
            unit="kg"
            width={40}
            domain={["auto", "auto"]}
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
          />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />

          {/* Recommendations / Goals */}
          {recommendations && (
            <>
              {/* Body Fat Goal Range - showing mid point or min/max lines */}
              <ReferenceLine
                yAxisId="left"
                y={recommendations.bodyFat.max}
                stroke="#ef4444"
                strokeDasharray="3 3"
                opacity={0.5}
              />
              <ReferenceLine
                yAxisId="left"
                y={recommendations.bodyFat.min}
                stroke="#ef4444"
                strokeDasharray="3 3"
                opacity={0.5}
              />
            </>
          )}

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="body_fat_percentage"
            name="% Grasa"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="muscle_mass"
            name="Masa Muscular (kg)"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
