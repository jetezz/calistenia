import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ReferenceArea,
} from "recharts";
import type { BMIChartData } from "@/hooks/client/WeightStats/useWeightStatsCharts";

interface BMIChartProps {
  data: BMIChartData[];
  className?: string;
}

export const BMIChart = ({ data, className }: BMIChartProps) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Índice de Masa Corporal (IMC)</CardTitle>
        <CardDescription>
          Evolución del IMC con zonas de referencia OMS
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
              domain={[15, 40]}
              label={{ value: "IMC", angle: -90, position: "insideLeft" }}
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

            {/* Zonas de referencia OMS */}
            <ReferenceArea
              y1={15}
              y2={18.5}
              fill="#facc15"
              fillOpacity={0.1}
              label={{ value: "Bajo peso", position: "insideTopLeft", fontSize: 10 }}
            />
            <ReferenceArea
              y1={18.5}
              y2={25}
              fill="#10b981"
              fillOpacity={0.1}
              label={{ value: "Normal", position: "insideTopLeft", fontSize: 10 }}
            />
            <ReferenceArea
              y1={25}
              y2={30}
              fill="#f97316"
              fillOpacity={0.1}
              label={{ value: "Sobrepeso", position: "insideTopLeft", fontSize: 10 }}
            />
            <ReferenceArea
              y1={30}
              y2={40}
              fill="#ef4444"
              fillOpacity={0.1}
              label={{ value: "Obesidad", position: "insideTopLeft", fontSize: 10 }}
            />

            {/* Líneas de referencia */}
            <ReferenceLine y={18.5} stroke="#facc15" strokeDasharray="3 3" />
            <ReferenceLine y={25} stroke="#10b981" strokeDasharray="3 3" />
            <ReferenceLine y={30} stroke="#f97316" strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="bmi"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: "#f59e0b", r: 4 }}
              activeDot={{ r: 6 }}
              name="IMC"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Leyenda de zonas */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-400/30 border border-yellow-400" />
            <span>Bajo peso (&lt;18.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500/30 border border-green-500" />
            <span>Normal (18.5-25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500/30 border border-orange-500" />
            <span>Sobrepeso (25-30)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500" />
            <span>Obesidad (&gt;30)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
