import type { LucideIcon } from "lucide-react";

export type NotificationType = "info" | "warning" | "success" | "action";

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  type: NotificationType;
  timestamp: string | Date;
  link?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}
