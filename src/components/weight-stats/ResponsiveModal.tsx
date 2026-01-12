import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: string;
  badges?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  footerClassName?: string;
  maxWidth?: string; // e.g. "sm:max-w-lg", "sm:max-w-[700px]"
}

export function ResponsiveModal({
  isOpen,
  onOpenChange,
  title,
  description,
  badges,
  children,
  footer,
  footerClassName,
  maxWidth = "sm:max-w-lg",
}: ResponsiveModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "w-[95vw] max-h-[92vh] p-0 gap-0 overflow-hidden rounded-2xl",
          maxWidth
        )}
      >
        {/* Compact Header - Mobile Optimized */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b px-4 py-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              {badges && (
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  {badges}
                </div>
              )}
              <DialogTitle className="text-lg sm:text-xl font-bold leading-tight flex items-center gap-2">
                {title}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-full -mt-1 -mr-1"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
          {description && (
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-4 py-5 space-y-5">{children}</div>

        {/* Mobile Action Footer */}
        {footer && (
          <div
            className={cn(
              "sticky bottom-0 border-t bg-background/95 backdrop-blur-sm px-4 py-3 z-10",
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
