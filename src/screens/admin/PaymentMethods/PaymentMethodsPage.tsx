import {
  Plus,
  Edit2,
  Trash2,
  Power,
  Wallet,
  Mail,
  Phone,
  Landmark,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StandardPage } from "@/components/common";
import { PaymentMethodDialog } from "@/components/admin";
import { toast } from "sonner";
import { useAdminPaymentMethodsLogic } from "@/hooks/admin/PaymentMethods/useAdminPaymentMethodsLogic";
import { getPaymentTypeLabel } from "@/lib/payment-utils";
import type { Database } from "@/types/database";

type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];

const getPaymentIcon = (type: string) => {
  switch (type) {
    case "bizum":
      return <Phone className="size-5 text-green-600" />;
    case "paypal":
      return <Mail className="size-5 text-blue-600" />;
    case "bank_transfer":
      return <Landmark className="size-5 text-purple-600" />;
    case "cash":
      return <Wallet className="size-5 text-orange-600" />;
    default:
      return <Wallet className="size-5 text-gray-600" />;
  }
};

export function PaymentMethodsPage() {
  const { methods, isLoading, refresh, deleteMethod, toggleActive } =
    useAdminPaymentMethodsLogic();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null
  );

  const handleCreate = () => {
    setEditingMethod(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(`¿Estás seguro de que quieres eliminar el método "${name}"?`)
    ) {
      return;
    }

    try {
      await deleteMethod(id);
      toast.success("Método de pago eliminado correctamente");
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("Error al eliminar el método de pago");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await toggleActive(id, !currentStatus);
      toast.success(currentStatus ? "Método desactivado" : "Método activado");
    } catch (error) {
      console.error("Error toggling method status:", error);
      toast.error("Error al cambiar el estado del método");
    }
  };

  const handleDialogClose = async (shouldRefresh: boolean) => {
    setIsDialogOpen(false);
    setEditingMethod(null);
    if (shouldRefresh) {
      await refresh();
    }
  };

  return (
    <StandardPage
      icon={Wallet}
      title="Métodos de Pago"
      description="Configura los métodos de pago disponibles para los clientes"
      onRefresh={refresh}
      isLoading={isLoading}
      loadingMessage="Cargando métodos de pago..."
      actionButton={
        <Button onClick={handleCreate} size="sm">
          <Plus className="size-4 mr-2" />
          Nuevo
        </Button>
      }
      maxWidth="max-w-4xl"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {methods.map((method) => (
          <Card
            key={method.id}
            className={!method.is_active ? "opacity-60" : ""}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {getPaymentIcon(method.type)}
                    {method.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={method.is_active ? "default" : "secondary"}>
                      {method.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getPaymentTypeLabel(method.type)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Orden: {method.display_order}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                {method.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <span className="font-mono">{method.contact_phone}</span>
                  </div>
                )}
                {method.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <span className="font-mono text-xs break-all">
                      {method.contact_email}
                    </span>
                  </div>
                )}
                {method.bank_account && (
                  <div className="flex items-center gap-2">
                    <Landmark className="size-4 text-muted-foreground" />
                    <span className="font-mono text-xs">
                      {method.bank_account}
                    </span>
                  </div>
                )}
                {method.instructions && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <p className="line-clamp-3">{method.instructions}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    handleToggleActive(method.id, method.is_active)
                  }
                >
                  <Power className="size-4 mr-1" />
                  {method.is_active ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(method)}
                >
                  <Edit2 className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(method.id, method.name)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {methods.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay métodos de pago configurados
            </h3>
            <p className="text-muted-foreground mb-4">
              Crea el primer método de pago para tus clientes
            </p>
            <Button onClick={handleCreate}>
              <Plus className="size-4 mr-2" />
              Crear Primer Método
            </Button>
          </CardContent>
        </Card>
      )}

      <PaymentMethodDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        editingMethod={editingMethod}
      />
    </StandardPage>
  );
}
