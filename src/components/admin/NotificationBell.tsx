import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/stores/notificationStore";

interface NotificationBellProps {
  isAdmin: boolean;
  onMarkAsSeen: () => void;
}

export function NotificationBell({
  isAdmin,
  onMarkAsSeen,
}: NotificationBellProps) {
  const { newBookingsCount } = useNotificationStore();

  if (!isAdmin) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onMarkAsSeen}
    >
      <Bell className="size-5" />
      {newBookingsCount > 0 && (
        <Badge className="absolute -top-1 -right-1 px-1.5 min-w-5 h-5 flex items-center justify-center bg-red-500 text-white border-2 border-background">
          {newBookingsCount}
        </Badge>
      )}
    </Button>
  );
}
