import { useState } from "react";
import { CreditCard, Check, X, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageLoadingState } from "@/components/common";
import { useAdminData, useToast } from "@/hooks";
import { useProfile } from "@/features/auth";
import { usePaymentRequestStore } from "@/stores";
import { profileService } from "@/services/profileService";
import type { Database } from "@/types/database";

type PaymentRequestWithUser =
  Database["public"]["Tables"]["payment_requests"]["Row"] & {
    user: { id: string; full_name: string | null; email: string };
  };

export function AdminPaymentRequestsPage() {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { success, error: showError } = useToast();
  const { profile: adminProfile } = useProfile();
  const {
    profiles,
    pendingPaymentRequests,
    allPaymentRequests,
    isDashboardLoading: isLoading,
    refresh,
  } = useAdminData();
  const { updatePaymentRequest: updatePaymentRequestStatus } =
    usePaymentRequestStore();

  // Combine pending and all payment requests
  // Combine pending and all payment requests
  const requests =
    allPaymentRequests.length > 0 ? allPaymentRequests : pendingPaymentRequests;

  const typedRequests: PaymentRequestWithUser[] = requests.map((req) => {
    // If user data is already present (e.g. from a different API version), use it
    const reqWithUser = req as unknown as PaymentRequestWithUser;
    if (reqWithUser.user) {
      return reqWithUser;
    }

    // Otherwise find user in loaded profiles
    const userProfile = profiles.find((p) => p.id === req.user_id);

    return {
      ...req,
      user: {
        id: req.user_id,
        full_name: userProfile?.full_name ?? "Usuario desconocido",
        email: userProfile?.email ?? "Sin email",
      },
    };
  });

  const handleProcessRequest = async (
    request: PaymentRequestWithUser,
    status: "approved" | "rejected"
  ) => {
    if (!adminProfile || processingId) return;

    try {
      setProcessingId(request.id);

      await updatePaymentRequestStatus(request.id, {
        status,
        admin_notes: null,
        processed_by: adminProfile.id,
        processed_at: new Date().toISOString(),
      });

      if (status === "approved") {
        await profileService.updateCredits(
          request.user_id,
          request.credits_requested
        );
      }

      success(`Solicitud ${status === "approved" ? "aprobada" : "rechazada"}`);

      // Refresh admin data after processing
      await refresh();
    } catch (error) {
      console.error("Error processing payment request:", error);
      showError("Error al procesar la solicitud");
    } finally {
      setProcessingId(null);
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>;
      case "approved":
        return <Badge className="bg-green-500 text-white">Aprobada</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rechazada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingRequests = typedRequests.filter(
    (req) => req.status === "pending"
  );
  const processedRequests = typedRequests.filter(
    (req) => req.status !== "pending"
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {isLoading ? (
        <PageLoadingState message="Cargando solicitudes de pago..." />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Solicitudes de Pago</h1>
              <p className="text-muted-foreground">
                Gestiona las solicitudes de recarga de créditos
              </p>
            </div>
            <Button onClick={refresh}>
              <CreditCard className="size-4 mr-2" />
              Actualizar Lista
            </Button>
          </div>

          {/* Pending Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5" />
                Solicitudes Pendientes ({pendingRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="size-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No hay solicitudes pendientes
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col p-4 border rounded-lg bg-yellow-50 border-yellow-200 gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="size-10 flex-shrink-0">
                            <AvatarFallback className="text-xs">
                              {getInitials(request.user.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {request.user.full_name || "Sin nombre"}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {request.user.email}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Solicitado: {formatDate(request.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="text-center flex-shrink-0 bg-white rounded-lg px-3 py-2 border">
                          <div className="text-2xl font-bold text-primary leading-none">
                            {request.credits_requested}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            créditos
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 flex-1"
                          onClick={() =>
                            handleProcessRequest(request, "approved")
                          }
                          disabled={processingId === request.id}
                        >
                          <Check className="size-4 sm:mr-1" />
                          <span className="hidden sm:inline">
                            {processingId === request.id
                              ? "Procesando..."
                              : "Aprobar"}
                          </span>
                          <span className="sm:hidden">
                            {processingId === request.id
                              ? "Procesando..."
                              : "Aprobar"}
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() =>
                            handleProcessRequest(request, "rejected")
                          }
                          disabled={processingId === request.id}
                        >
                          <X className="size-4 sm:mr-1" />
                          <span className="hidden sm:inline">
                            {processingId === request.id
                              ? "Procesando..."
                              : "Rechazar"}
                          </span>
                          <span className="sm:hidden">
                            {processingId === request.id
                              ? "Procesando..."
                              : "Rechazar"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processed Requests */}
          {processedRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="size-5" />
                  Solicitudes Procesadas ({processedRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {processedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="size-10">
                          <AvatarFallback className="text-xs">
                            {getInitials(request.user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {request.user.full_name || "Sin nombre"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.credits_requested} créditos •{" "}
                            {formatDate(request.created_at)}
                          </div>
                          {request.admin_notes && (
                            <div className="text-xs text-muted-foreground italic">
                              "{request.admin_notes}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 mt-2 sm:mt-0">
                        {getRequestStatusBadge(request.status)}
                        {request.processed_at && (
                          <div className="text-xs text-muted-foreground">
                            {formatDate(request.processed_at)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
