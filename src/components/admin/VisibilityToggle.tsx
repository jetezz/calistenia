import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface VisibilityToggleProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}

export function VisibilityToggle({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  description,
}: VisibilityToggleProps) {
  return (
    <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          {checked ? (
            <Eye className="size-4 text-green-600" />
          ) : (
            <EyeOff className="size-4 text-muted-foreground" />
          )}
          <Label
            htmlFor={`visibility-${label}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </Label>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={`visibility-${label}`}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}
