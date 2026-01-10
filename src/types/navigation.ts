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
    to: "/app/admin",
    label: "Panel",
    icon: "LayoutDashboard",
  },
  {
    to: "/app/admin/slots",
    label: "Horarios",
    icon: "Clock",
  },
  {
    to: "/app/admin/users",
    label: "Usuarios",
    icon: "Users",
  },
  {
    to: "/app/admin/bookings",
    label: "Reservas",
    icon: "CalendarDays",
  },
  {
    to: "/app/admin/pricing",
    label: "Precios",
    icon: "DollarSign",
  },
  {
    to: "/app/admin/payment-requests",
    label: "Pagos",
    icon: "CreditCard",
  },
  {
    to: "/app/admin/payment-methods",
    label: "Métodos Pago",
    icon: "Wallet",
  },
  {
    to: "/app/admin/settings",
    label: "Configuración",
    icon: "Settings",
  },
];
