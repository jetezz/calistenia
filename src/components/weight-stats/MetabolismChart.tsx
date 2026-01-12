import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MetabolismChartData } from "@/hooks/client/WeightStats/useWeightStatsCharts";

interface MetabolismChartProps {
  data: MetabolismChartData[];
  className?: string;
}

export const MetabolismChart = ({ data, className }: MetabolismChartProps) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Metabolismo y Calorías</CardTitle>
        <CardDescription>
          Calorías diarias (barras) y edad metabólica (línea)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="formattedDate"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              yAxisId="left"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              label={{ value: "kcal", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              label={{ value: "años", angle: 90, position: "insideRight" }}
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
            <Bar
              yAxisId="left"
              dataKey="calories"
              fill="#f97316"
              name="Calorías Diarias (kcal)"
              radius={[8, 8, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="metabolicAge"
              stroke="#ec4899"
              strokeWidth={3}
              dot={{ fill: "#ec4899", r: 4 }}
              activeDot={{ r: 6 }}
              name="Edad Metabólica (años)"
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            <strong>Calorías Diarias:</strong> Estimación del gasto calórico basal diario
          </p>
          <p>
            <strong>Edad Metabólica:</strong> Edad estimada según tu metabolismo
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
