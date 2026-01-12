import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  recommendation?: {
    target: number | string;
    label?: string;
    status?: "good" | "warning" | "alert";
  };
  className?: string;
  onClick?: () => void;
}

export const StatCard = ({
  title,
  value,
  unit,
  trend,
  icon,
  recommendation,
  className,
  onClick,
}: StatCardProps) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        onClick && "cursor-pointer transition-colors hover:bg-muted/50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          {icon && <span className="text-muted-foreground">{icon}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>

          <div className="flex justify-between items-end">
            {trend ? (
              <div className="flex items-center gap-1 text-xs">
                {trend.value === "0" ||
                trend.value === "0.00" ||
                trend.value === "0.0" ? (
                  <>
                    <Minus className="size-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Sin cambios</span>
                  </>
                ) : trend.isPositive ? (
                  <>
                    <TrendingUp className="size-3 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400">
                      +{trend.value} {trend.label || ""}
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="size-3 text-red-600 dark:text-red-400" />
                    <span className="text-red-600 dark:text-red-400">
                      {trend.value} {trend.label || ""}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div></div>
            )}

            {recommendation && (
              <div
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border",
                  recommendation.status === "good"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : recommendation.status === "alert"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                )}
              >
                {recommendation.label || `Meta: ${recommendation.target}`}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
