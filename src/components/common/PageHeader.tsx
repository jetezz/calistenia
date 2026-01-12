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
  /** Función para recargar datos (deprecated: usar topActions) */
  onRefresh?: () => void;
  /** Botón de acción adicional (deprecated: usar topActions o bottomActions) */
  actionButton?: ReactNode;
  /** Botones que se muestran en la fila superior (a la derecha del título) */
  topActions?: ReactNode;
  /** Botones que se muestran en la fila inferior (siempre alineados a la derecha) */
  bottomActions?: ReactNode;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  onRefresh,
  actionButton,
  topActions,
  bottomActions,
}: PageHeaderProps) {
  // Backward compatibility: si se usan las props antiguas, las convertimos al nuevo formato
  const hasTopActions = topActions !== undefined;
  const hasBottomActions = bottomActions !== undefined;

  const finalTopActions = hasTopActions ? (
    topActions
  ) : (
    <>
      {onRefresh && (
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 shadow-sm hover:shadow transition-shadow shrink-0"
        >
          <RefreshCw className="size-4" />
        </Button>
      )}
      {actionButton}
    </>
  );

  const finalBottomActions = hasBottomActions ? bottomActions : null;

  return (
    <div className="flex flex-col gap-2">
      {/* Header: Title left, buttons right with wrapping */}
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-start">
        {/* Left Column: Icon + Title - Always visible, never wraps */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shrink-0">
            <Icon className="size-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent whitespace-nowrap">
            {title}
          </h1>
        </div>

        {/* Right Column Top Row: Buttons that stay on the same line as title */}
        <div className="flex items-center gap-2 justify-end">
          {finalTopActions}
        </div>

        {/* Right Column Bottom Row: Buttons that always go below (if provided) */}
        {finalBottomActions && (
          <>
            {/* Empty cell for left column alignment */}
            <div />
            <div className="flex items-center gap-2 justify-end">
              {finalBottomActions}
            </div>
          </>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground ml-11 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
