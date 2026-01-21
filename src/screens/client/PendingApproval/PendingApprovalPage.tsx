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
import { Clock, LogOut, RefreshCw } from "lucide-react";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { PageLoadingState } from "@/components/common";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function PendingApprovalPage() {
  const { signOut, user } = useAuth();
  const {
    profile,
    isLoading,
    isRefreshing,
    isApproved,
    isRejected,
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

  if (!user && !isLoading) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isLoading) {
    return <PageLoadingState message="Cargando..." />;
  }

  // Si el usuario ya fue aprobado, redirigir a home
  if (isApproved || isAdmin) {
    return <Navigate to={ROUTES.APP.ROOT} replace />;
  }

  // Si el usuario fue rechazado, redirigir a rejected
  if (isRejected) {
    return <Navigate to={ROUTES.REJECTED} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Pendiente de Aprobación
          </CardTitle>
          <CardDescription className="text-base">
            Tu cuenta está siendo revisada por un administrador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 text-center">
              Tu cuenta ha sido creada exitosamente. Un administrador revisará
              tu solicitud y te dará acceso a la aplicación pronto.
            </p>
          </div>

          {profile && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{profile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre:</span>
                <span className="font-medium">
                  {profile.full_name || "No especificado"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium text-yellow-600">Pendiente</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Tu estado se verifica automáticamente cada 5 segundos.
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
