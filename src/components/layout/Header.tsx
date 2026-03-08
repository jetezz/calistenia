import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, Store } from "lucide-react";
import { useAuth, useProfile } from "@/features/auth";
import { useProfileStore } from "@/stores/profileStore"; // Added import
import { useBrandingSettings } from "@/hooks/admin/Branding/useBrandingSettings";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { getFullPath } from "@/lib/routeUtils";
import { NotificationCenter } from "@/features/notifications/components/NotificationCenter";

export function Header() {
  const { signOut } = useAuth();
  const { profile, isAdmin } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useBrandingSettings();
  const { setViewMode } = useProfileStore(); // Get action

  const isOnAdminRoute = location.pathname.startsWith("/app/admin");

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      toast.error("Error al cerrar sesión");
      console.error("Error signing out:", error);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewSwitch = () => {
    if (isOnAdminRoute) {
      // Switch to Client View
      setViewMode("client");
      navigate(ROUTES.APP.ROOT);
    } else {
      // Switch to Admin View
      setViewMode("default");
      navigate(getFullPath(ROUTES.ADMIN.ROOT));
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border safe-area-pt">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between min-h-[64px]">
        <Link
          to={isAdmin ? getFullPath(ROUTES.ADMIN.ROOT) : ROUTES.APP.ROOT}
          className="flex items-center gap-2 touch-none min-w-0 flex-1"
        >
          {/* Logo */}
          {settings?.show_logo && settings?.logo_url && (
            <img
              src={settings.logo_url}
              alt={settings.business_name || "Logo"}
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0"
            />
          )}

          {/* Business Name */}
          <span className="font-bold text-sm sm:text-base md:text-lg truncate">
            {settings?.business_name || "Calistenia Emérita"}
          </span>

          {/* Admin Badge - Only visible to admins */}
          {isAdmin && (
            <Badge
              variant="secondary"
              className="text-[10px] sm:text-xs shrink-0 hidden sm:inline-flex"
            >
              Admin
            </Badge>
          )}
        </Link>

        <div className="flex items-center gap-1 sm:gap-3 shrink-0 ml-1 sm:ml-2">
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewSwitch}
              className="text-muted-foreground hover:text-foreground px-2 sm:px-3 h-9 sm:h-9"
              title={isOnAdminRoute ? "Ir a Vista Cliente" : "Ir a Panel Admin"}
            >
              {isOnAdminRoute ? (
                <Store className="size-5 sm:size-4 sm:mr-2" />
              ) : (
                <LayoutDashboard className="size-5 sm:size-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">
                {isOnAdminRoute ? "Vista Cliente" : "Vista Admin"}
              </span>
            </Button>
          )}
          <NotificationCenter isAdmin={isAdmin} />
          {import.meta.env.VITE_APP_ENV === "test" ? (
            <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 sm:px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800 animate-pulse">
              <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">
                TEST
              </span>
            </div>
          ) : (
            <div className="items-center gap-2 hidden sm:flex">
              <Avatar className="size-9">
                <AvatarFallback className="text-sm font-medium">
                  {getInitials(profile?.full_name ?? null)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium max-w-32 truncate">
                {profile?.full_name || profile?.email}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            aria-label="Cerrar sesión"
            className="size-10 hover:bg-destructive/10 hover:text-destructive focus:ring-2 focus:ring-destructive/50"
          >
            <LogOut className="size-5" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
