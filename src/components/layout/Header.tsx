import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, Store } from "lucide-react";
import { useAuth, useProfile } from "@/features/auth";
import { NotificationBell } from "@/components/admin";
import { useNotifications } from "@/hooks";
import { useBookingStore } from "@/stores/bookingStore";
import { useProfileStore } from "@/stores/profileStore"; // Added import
import { useBrandingSettings } from "@/hooks/admin/Branding/useBrandingSettings";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { getFullPath } from "@/lib/routeUtils";

export function Header() {
  const { signOut } = useAuth();
  const { profile, isAdmin } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useBrandingSettings();
  const { setViewMode } = useProfileStore(); // Get action

  const isOnAdminRoute = location.pathname.startsWith("/app/admin");

  const { items: bookings, fetchAll } = useBookingStore();

  // Fetch bookings if admin to show notifications
  useEffect(() => {
    if (isAdmin) {
      fetchAll();
    }
  }, [isAdmin, fetchAll]);

  const today = new Date().toISOString().split("T")[0];
  const todayBookingsCount = bookings.filter(
    (b) => b.booking_date === today && b.status === "confirmed"
  ).length;

  const { markAsSeen } = useNotifications(isAdmin, todayBookingsCount);

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
          className="flex items-center gap-2 touch-none"
        >
          {/* Logo */}
          {settings?.show_logo && settings?.logo_url && (
            <img
              src={settings.logo_url}
              alt={settings.business_name || "Logo"}
              className="h-8 w-8 object-contain"
            />
          )}

          {/* Business Name */}
          <span className="text-lg font-bold">
            {settings?.business_name || "Calistenia Emérita"}
          </span>

          {/* Admin Badge - Only visible to admins */}
          {isAdmin && (
            <Badge variant="secondary" className="text-xs">
              Admin
            </Badge>
          )}
        </Link>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewSwitch}
              className="text-muted-foreground hover:text-foreground"
              title={isOnAdminRoute ? "Ir a Vista Cliente" : "Ir a Panel Admin"}
            >
              {isOnAdminRoute ? (
                <Store className="size-4 sm:mr-2" />
              ) : (
                <LayoutDashboard className="size-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">
                {isOnAdminRoute ? "Vista Cliente" : "Vista Admin"}
              </span>
            </Button>
          )}
          <NotificationBell isAdmin={isAdmin} onMarkAsSeen={markAsSeen} />
          <div className="flex items-center gap-2">
            <Avatar className="size-9">
              <AvatarFallback className="text-sm font-medium">
                {getInitials(profile?.full_name ?? null)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium max-w-32 truncate">
              {profile?.full_name || profile?.email}
            </span>
          </div>
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
