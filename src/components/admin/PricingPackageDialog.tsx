import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminPricingLogic } from "@/hooks/admin/Pricing/useAdminPricingLogic";
import { toast } from "sonner";
import type { Database } from "@/types/database";

type PricingPackage = Database["public"]["Tables"]["pricing_packages"]["Row"];

interface PricingPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPackage: PricingPackage | null;
}

export function PricingPackageDialog({
  open,
  onOpenChange,
  editingPackage,
}: PricingPackageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingPackage ? "Editar" : "Nuevo"} Paquete de Precios
          </DialogTitle>
        </DialogHeader>
        {open && (
          <PricingPackageForm
            editingPackage={editingPackage}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface FormProps {
  editingPackage: PricingPackage | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function PricingPackageForm({
  editingPackage,
  onSuccess,
  onCancel,
}: FormProps) {
  const { createPackage, updatePackage } = useAdminPricingLogic();

  const [formData, setFormData] = useState<Partial<PricingPackage>>(
    editingPackage || {
      name: "",
      package_name: "",
      credits: 10,
      price: 30,
      is_active: true,
      display_order: 0,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPackage?.id) {
        await updatePackage(editingPackage.id, formData);
        toast.success("Paquete de precios actualizado");
      } else {
        await createPackage(
          formData as Database["public"]["Tables"]["pricing_packages"]["Insert"]
        );
        toast.success("Paquete de precios creado");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Error al guardar el paquete");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nombre Visual (ej: 10 Clases)</Label>
        <Input
          id="name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: 10 Clases"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="package_name">Nombre Interno (ej: Bono Básico)</Label>
        <Input
          id="package_name"
          value={formData.package_name || ""}
          onChange={(e) =>
            setFormData({ ...formData, package_name: e.target.value })
          }
          placeholder="Ej: Bono Oro"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="credits">Clases/Créditos</Label>
          <Input
            id="credits"
            type="number"
            value={formData.credits || 0}
            onChange={(e) =>
              setFormData({
                ...formData,
                credits: parseInt(e.target.value),
              })
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Precio (€)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price || 0}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value),
              })
            }
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="display_order">Orden de Visualización</Label>
        <Input
          id="display_order"
          type="number"
          value={formData.display_order || 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              display_order: parseInt(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_active: !!checked })
          }
        />
        <Label htmlFor="is_active">Activo</Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{editingPackage ? "Actualizar" : "Crear"}</Button>
      </DialogFooter>
    </form>
  );
}
