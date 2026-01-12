import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import type { WeightCompositionChartData } from "@/hooks/client/WeightStats/useWeightStatsCharts";
import type { IdealStats } from "@/utils/biometricsCalculators";

interface WeightCompositionChartProps {
  data: WeightCompositionChartData[];
  recommendations?: IdealStats | null;
  className?: string;
}

export const WeightCompositionChart = ({
  data,
  recommendations,
  className,
}: WeightCompositionChartProps) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Peso y Composición Corporal</CardTitle>
        <CardDescription>
          Evolución del peso, masa muscular y masa ósea (kg)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="formattedDate"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              label={{ value: "kg", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            {recommendations && (
              <>
                <ReferenceLine
                  y={recommendations.weight.min}
                  stroke="#3b82f6"
                  strokeDasharray="3 3"
                  opacity={0.3}
                />
                <ReferenceLine
                  y={recommendations.weight.max}
                  stroke="#3b82f6"
                  strokeDasharray="3 3"
                  opacity={0.3}
                  label={{
                    value: "Peso Ideal (Max)",
                    fontSize: 10,
                    fill: "#3b82f6",
                    position: "insideTopRight",
                  }}
                />

                {/* Muscle Mass Target */}
                <ReferenceLine
                  y={recommendations.muscleMass.min}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  opacity={0.3}
                />
                <ReferenceLine
                  y={recommendations.muscleMass.max}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  opacity={0.3}
                  label={{
                    value: "Músculo Ideal (Max)",
                    fontSize: 10,
                    fill: "#10b981",
                    position: "insideBottomRight",
                  }}
                />
              </>
            )}
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
              name="Peso (kg)"
            />
            <Line
              type="monotone"
              dataKey="muscleMass"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 3 }}
              activeDot={{ r: 5 }}
              name="Masa Muscular (kg)"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="boneMass"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 3 }}
              activeDot={{ r: 5 }}
              name="Masa Ósea (kg)"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
