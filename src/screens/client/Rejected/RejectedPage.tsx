import { useEffect } from "react";
import { useAuth } from "@/features/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, LogOut, RefreshCw } from "lucide-react";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { PageLoadingState } from "@/components/common";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function RejectedPage() {
  const { signOut } = useAuth();
  const {
    profile,
    isLoading,
    isRefreshing,
    isApproved,
    isPending,
    isAdmin,
    refreshProfile,
  } = useProfile();

  // Refrescar el perfil cada 5 segundos para detectar cambios
  useEffect(() => {
    const interval = setInterval(() => {
      refreshProfile();
    }, 5000); // Refrescar cada 5 segundos

    return () => clearInterval(interval);
  }, [refreshProfile]);

  if (isLoading) {
    return <PageLoadingState message="Cargando..." />;
  }

  // Si el usuario ya fue aprobado, redirigir a home
  if (isApproved || isAdmin) {
    return <Navigate to={ROUTES.APP.ROOT} replace />;
  }

  // Si el usuario fue puesto en pendiente de nuevo, redirigir a pending
  if (isPending) {
    return <Navigate to={ROUTES.PENDING_APPROVAL} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Acceso Denegado</CardTitle>
          <CardDescription className="text-base">
            Tu solicitud de acceso no ha sido aprobada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 text-center">
              Lamentablemente, tu solicitud de acceso a la aplicación no ha sido
              aprobada por un administrador.
            </p>
          </div>

          {profile && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{profile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium text-red-600">Rechazado</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Si crees que esto es un error, contacta con el administrador. Tu
              estado se verifica automáticamente cada 5 segundos.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => refreshProfile()}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Verificando..." : "Verificar Estado Ahora"}
              </Button>
              <Button variant="outline" className="w-full" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
