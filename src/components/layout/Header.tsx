import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth, useProfile } from "@/features/auth";
import { NotificationBell } from "@/components/admin";
import { useNotifications } from "@/hooks";
import { useBookingStore } from "@/stores/bookingStore";
import { useBrandingSettings } from "@/hooks/admin/Branding/useBrandingSettings";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function Header() {
  const { signOut } = useAuth();
  const { profile, isAdmin } = useProfile();
  const navigate = useNavigate();
  const { settings } = useBrandingSettings();

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
      navigate("/login", { replace: true });
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

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between min-h-[64px]">
        <Link
          to={isAdmin ? "/app/admin" : "/app"}
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
