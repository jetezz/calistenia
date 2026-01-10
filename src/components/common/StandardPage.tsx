import type { LucideIcon } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { LoadingState } from "./LoadingStates";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StandardPageProps {
  /** Contenido de la página */
  children: ReactNode;
  /** Icono de la cabecera */
  icon?: LucideIcon;
  /** Título de la cabecera */
  title?: string;
  /** Descripción de la cabecera */
  description?: string;
  /** Función para recargar datos */
  onRefresh?: () => void;
  /** Botón de acción adicional en la cabecera */
  actionButton?: ReactNode;
  /** Estado de carga */
  isLoading?: boolean;
  /** Mensaje de carga personalizado */
  loadingMessage?: string;
  /** Ancho máximo del contenedor (default: max-w-4xl) */
  maxWidth?:
    | "max-w-xl"
    | "max-w-2xl"
    | "max-w-3xl"
    | "max-w-4xl"
    | "max-w-5xl"
    | "max-w-6xl"
    | "max-w-7xl"
    | "max-w-full";
  /** Clases adicionales para el contenedor */
  className?: string;
}

/**
 * Componente de diseño estándar para las páginas de la aplicación.
 * Asegura que el padding, el ancho máximo y el posicionamiento de la cabecera
 * sean consistentes en toda la aplicación.
 */
export function StandardPage({
  children,
  icon,
  title,
  description,
  onRefresh,
  actionButton,
  isLoading,
  loadingMessage,
  maxWidth = "max-w-4xl",
  className = "",
}: StandardPageProps) {
  return (
    <div
      className={cn(
        "container mx-auto px-4 pt-6 pb-20 md:pb-32 space-y-6",
        maxWidth,
        className
      )}
    >
      {(icon || title || description) && (
        <PageHeader
          icon={icon as LucideIcon}
          title={title || ""}
          description={description}
          onRefresh={onRefresh}
          actionButton={actionButton}
        />
      )}
      {isLoading ? (
        <LoadingState message={loadingMessage} className="min-h-[200px]" />
      ) : (
        children
      )}
    </div>
  );
}
