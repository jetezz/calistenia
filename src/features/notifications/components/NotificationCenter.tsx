import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAggregatedNotifications } from "../hooks/useAggregatedNotifications";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface NotificationCenterProps {
  isAdmin: boolean;
}

export function NotificationCenter({ isAdmin }: NotificationCenterProps) {
  const { notifications, count, refresh } = useAggregatedNotifications(isAdmin);
  const [open, setOpen] = useState(false);

  // Refresh data when opening
  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);

  if (!isAdmin) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-5" />
          {count > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 min-w-5 h-5 flex items-center justify-center bg-red-500 text-white border-2 border-background">
              {count}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold text-sm">Notificaciones</h4>
          <span className="text-xs text-muted-foreground">
            {count} pendientes
          </span>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground p-4 text-center">
              <Bell className="size-8 mb-2 opacity-20" />
              <p className="text-sm">No tienes notificaciones pendientes</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => {
                const Icon = notification.icon || Bell;
                return (
                  <Link
                    key={notification.id}
                    to={notification.link || "#"}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors border-b last:border-0"
                  >
                    <div
                      className={cn(
                        "mt-1 rounded-full p-2",
                        notification.type === "action"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : notification.type === "warning"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(notification.timestamp),
                            {
                              addSuffix: true,
                              locale: es,
                            }
                          )}
                        </span>
                        {notification.actionLabel && (
                          <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            {notification.actionLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
