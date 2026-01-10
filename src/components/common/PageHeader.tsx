import { RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Icono de la página */
  icon: LucideIcon;
  /** Título de la página */
  title: string;
  /** Descripción opcional */
  description?: string;
  /** Función para recargar datos */
  onRefresh?: () => void;
  /** Botón de acción adicional (ej: "+ Nuevo") */
  actionButton?: ReactNode;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  onRefresh,
  actionButton,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between h-[44px]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shrink-0">
            <Icon className="size-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 shadow-sm hover:shadow transition-shadow"
            >
              <RefreshCw className="size-4" />
            </Button>
          )}
          {actionButton}
        </div>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground ml-11">{description}</p>
      )}
    </div>
  );
}
