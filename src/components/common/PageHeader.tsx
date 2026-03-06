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
          className="h-9 w-9 !flex-none p-0 shadow-sm hover:shadow transition-shadow shrink-0"
        >
          <RefreshCw className="size-4" />
        </Button>
      )}
      {actionButton}
    </>
  );

  const finalBottomActions = hasBottomActions ? bottomActions : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header Content: Icon, Title, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-4">
        {/* Left Column: Icon + Title */}
        <div className="flex items-center gap-3 shrink-0 flex-1 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shrink-0 flex items-center justify-center">
            <Icon className="size-5 sm:size-6 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent break-words line-clamp-2">
            {title}
          </h1>
        </div>

        {/* Right Column: Top Actions */}
        {finalTopActions && (
          <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
            {finalTopActions}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {finalBottomActions && (
        <div className="flex flex-wrap items-center sm:justify-end gap-2">
          {finalBottomActions}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground sm:ml-[3.5rem] leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
