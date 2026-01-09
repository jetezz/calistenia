import { Plus, Edit2, Trash2, Power, DollarSign } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoadingState } from "@/components/common";
// TODO: Re-implement PricingPackageDialog component
import { PricingPackageDialog } from "@/components/admin";
import { toast } from "sonner";
import { useAdminPricingLogic } from "@/hooks/admin/Pricing/useAdminPricingLogic";
import type { Database } from "@/types/database";

type PricingPackage = Database["public"]["Tables"]["pricing_packages"]["Row"];

export function PricingPage() {
  const { packages, isLoading, refresh, deletePackage, toggleActive } =
    useAdminPricingLogic();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(
    null
  );

  const handleCreate = () => {
    setEditingPackage(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (pkg: PricingPackage) => {
    setEditingPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(`¿Estás seguro de que quieres eliminar el paquete "${name}"?`)
    ) {
      return;
    }

    try {
      await deletePackage(id);
      toast.success("Paquete eliminado correctamente");
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Error al eliminar el paquete");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await toggleActive(id, !currentStatus);
      toast.success(
        `Paquete ${!currentStatus ? "activado" : "desactivado"} correctamente`
      );
    } catch (error) {
      console.error("Error toggling package status:", error);
      toast.error("Error al cambiar el estado del paquete");
    }
  };

  const handleDialogClose = async (shouldRefresh: boolean) => {
    setIsDialogOpen(false);
    setEditingPackage(null);
    if (shouldRefresh) {
      await refresh();
    }
  };

  if (isLoading && packages.length === 0) {
    return <PageLoadingState message="Cargando paquetes de precios..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Precios</h1>
          <p className="text-muted-foreground mt-1">
            Configura los paquetes de clases disponibles para los clientes
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="size-4 mr-2" />
          Nuevo Paquete
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={!pkg.is_active ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="size-5 text-green-600" />
                    {pkg.package_name && (
                      <span className="text-primary">
                        {pkg.package_name} -{" "}
                      </span>
                    )}
                    {pkg.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={pkg.is_active ? "default" : "secondary"}>
                      {pkg.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Orden: {pkg.display_order}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Clases:</span>
                  <span className="font-semibold text-lg">{pkg.credits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Precio:</span>
                  <span className="font-bold text-xl text-green-600">
                    {pkg.price}€
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Precio/clase:</span>
                  <span>{(pkg.price / pkg.credits).toFixed(2)}€</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleActive(pkg.id, pkg.is_active)}
                >
                  <Power className="size-4 mr-1" />
                  {pkg.is_active ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(pkg)}
                >
                  <Edit2 className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(pkg.id, pkg.name)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay paquetes configurados
            </h3>
            <p className="text-muted-foreground mb-4">
              Crea el primer paquete de precios para tus clientes
            </p>
            <Button onClick={handleCreate}>
              <Plus className="size-4 mr-2" />
              Crear Primer Paquete
            </Button>
          </CardContent>
        </Card>
      )}

      <PricingPackageDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        editingPackage={editingPackage}
      />
    </div>
  );
}
