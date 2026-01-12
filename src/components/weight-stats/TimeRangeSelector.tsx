import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimeRange } from "@/stores/weightStatsStore";

interface TimeRangeSelectorProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7 días" },
  { value: "1m", label: "1 mes" },
  { value: "3m", label: "3 meses" },
  { value: "6m", label: "6 meses" },
  { value: "1y", label: "1 año" },
  { value: "all", label: "Todo" },
];

export const TimeRangeSelector = ({
  selected,
  onChange,
  className,
}: TimeRangeSelectorProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {timeRanges.map((range) => (
        <Button
          key={range.value}
          variant={selected === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(range.value)}
          className={cn(
            "transition-all",
            selected === range.value && "shadow-md"
          )}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};
