import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({
  title = "No hay mediciones registradas",
  description = "Comienza a registrar tus mediciones de composición corporal para ver tu progreso en gráficos.",
  action,
}: EmptyStateProps) => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Activity className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
};
