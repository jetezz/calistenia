import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  DollarSign,
  CreditCard,
  Settings,
  Wallet,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { getFullPath } from "@/lib/routeUtils";

export interface NavAction {
  to: string;
  label: string;
  icon: keyof typeof ICONS;
}

export const ICONS = {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  DollarSign,
  CreditCard,
  Settings,
  Wallet,
} as const;

export type IconName = keyof typeof ICONS;

export const ADMIN_AVAILABLE_ACTIONS: NavAction[] = [
  {
    to: getFullPath(ROUTES.ADMIN.ROOT),
    label: "Panel",
    icon: "LayoutDashboard",
  },
  {
    to: getFullPath(ROUTES.ADMIN.SLOTS),
    label: "Horarios",
    icon: "Clock",
  },
  {
    to: getFullPath(ROUTES.ADMIN.USERS),
    label: "Usuarios",
    icon: "Users",
  },
  {
    to: getFullPath(ROUTES.ADMIN.BOOKINGS),
    label: "Reservas",
    icon: "CalendarDays",
  },
  {
    to: getFullPath(ROUTES.ADMIN.PRICING),
    label: "Precios",
    icon: "DollarSign",
  },
  {
    to: getFullPath(ROUTES.ADMIN.PAYMENT_REQUESTS),
    label: "Pagos",
    icon: "CreditCard",
  },
  {
    to: getFullPath(ROUTES.ADMIN.PAYMENT_METHODS),
    label: "Métodos Pago",
    icon: "Wallet",
  },
  {
    to: getFullPath(ROUTES.ADMIN.SETTINGS),
    label: "Configuración",
    icon: "Settings",
  },
];
