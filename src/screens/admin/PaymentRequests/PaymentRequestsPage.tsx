import { useState } from "react";
import { CreditCard, Check, X, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageLoadingState, StandardPage } from "@/components/common";
import { useAdminPaymentRequestsLogic } from "@/hooks/admin/PaymentRequests/useAdminPaymentRequestsLogic";

export function PaymentRequestsPage() {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { requests, isLoading, handleApprove, handleReject, refresh } =
    useAdminPaymentRequestsLogic();

  // Helper local para renderizado
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const processRequest = async (id: string, action: "approve" | "reject") => {
    setProcessingId(id);
    try {
      if (action === "approve") {
        await handleApprove(id);
      } else {
        await handleReject(id);
      }
    } catch (error) {
      console.error("Error processing", error);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  if (isLoading) {
    return <PageLoadingState message="Cargando solicitudes de pago..." />;
  }

  return (
    <StandardPage
      icon={CreditCard}
      title="Solicitudes de Pago"
      description="Gestiona las solicitudes de recarga de créditos"
      onRefresh={refresh}
      maxWidth="max-w-4xl"
    >
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
                      <Avatar className="size-10 shrink-0">
                        <AvatarFallback className="text-xs">
                          {getInitials(request.user?.full_name || "U")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {request.user?.full_name || "Sin nombre"}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {request.user?.email || "Sin email"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Solicitado: {formatDate(request.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-center shrink-0 bg-white rounded-lg px-3 py-2 border">
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
                      onClick={() => processRequest(request.id, "approve")}
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
                      onClick={() => processRequest(request.id, "reject")}
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
                        {getInitials(request.user?.full_name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {request.user?.full_name || "Sin nombre"}
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
    </StandardPage>
  );
}
