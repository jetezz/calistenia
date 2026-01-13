import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  CalendarDays,
  CreditCard,
  Calendar,
  Activity,
} from "lucide-react";
import { useProfile } from "@/features/auth";
import { cn } from "@/lib/utils";
import { useAppSettingsStore } from "@/stores/appSettingsStore";
import { ROUTES } from "@/constants/routes";
import { getFullPath } from "@/lib/routeUtils";
import { ADMIN_AVAILABLE_ACTIONS, ICONS } from "@/types/navigation";

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export function MobileNav() {
  const { isAdmin } = useProfile();
  const location = useLocation();

  // Check if currently on an admin route
  const isOnAdminRoute = location.pathname.startsWith("/app/admin");

  const clientNavItems: NavItem[] = [
    { to: ROUTES.APP.ROOT, icon: <Home className="size-5" />, label: "Inicio" },
    {
      to: getFullPath(ROUTES.APP.BOOK),
      icon: <CalendarDays className="size-5" />,
      label: "Reservar",
    },
    {
      to: getFullPath(ROUTES.APP.MY_BOOKINGS),
      icon: <Calendar className="size-5" />,
      label: "Mis Clases",
    },
    {
      to: getFullPath(ROUTES.APP.WEIGHT_STATS),
      icon: <Activity className="size-5" />,
      label: "Estadísticas",
    },
    {
      to: getFullPath(ROUTES.APP.REQUEST_CREDITS),
      icon: <CreditCard className="size-5" />,
      label: "Créditos",
    },
  ];

  const { getQuickActions } = useAppSettingsStore();
  const quickActionPaths = getQuickActions();

  // Ensure panel is always first and not duplicated
  const panelPath = getFullPath(ROUTES.ADMIN.ROOT);
  const otherActions = quickActionPaths.filter((path) => path !== panelPath);

  const adminNavItems: NavItem[] = [
    // Always add Panel first
    (() => {
      const action = ADMIN_AVAILABLE_ACTIONS.find((a) => a.to === panelPath);
      if (!action) return null; // Should not happen
      const Icon = ICONS[action.icon];
      return {
        to: action.to,
        icon: <Icon className="size-5" />,
        label: action.label,
      };
    })(),
    // Map other actions
    ...otherActions.map((path) => {
      const action = ADMIN_AVAILABLE_ACTIONS.find((a) => a.to === path);
      if (!action) return null;
      const Icon = ICONS[action.icon];
      return {
        to: action.to,
        icon: <Icon className="size-5" />,
        label: action.label,
      };
    }),
  ].filter((item) => item !== null) as NavItem[];

  // Show admin nav if user is admin AND currently on an admin route
  const navItems = isAdmin && isOnAdminRoute ? adminNavItems : clientNavItems;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border mobile-nav-container"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs font-medium transition-all duration-200",
                "hover:bg-accent/50 active:bg-accent active:scale-95 transform",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <div
              className={cn(
                "transition-transform duration-200",
                "group-active:scale-110"
              )}
            >
              {item.icon}
            </div>
            <span className="text-[10px] leading-tight">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
