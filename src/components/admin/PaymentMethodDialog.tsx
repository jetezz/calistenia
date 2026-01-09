import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminPaymentMethodsLogic } from "@/hooks/admin/PaymentMethods/useAdminPaymentMethodsLogic";
import { toast } from "sonner";
import type { Database } from "@/types/database";

type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMethod: PaymentMethod | null;
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
  editingMethod,
}: PaymentMethodDialogProps) {
  const { createMethod, updateMethod } = useAdminPaymentMethodsLogic();
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    name: "",
    type: "bizum",
    is_active: true,
    display_order: 0,
    contact_phone: "",
    contact_email: "",
    bank_account: "",
    instructions: "",
  });

  useEffect(() => {
    if (open) {
      if (editingMethod) {
        setFormData(editingMethod);
      } else {
        setFormData({
          name: "",
          type: "bizum",
          is_active: true,
          display_order: 0,
          contact_phone: "",
          contact_email: "",
          bank_account: "",
          instructions: "",
        });
      }
    }
  }, [editingMethod, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMethod) {
        await updateMethod(editingMethod.id, formData);
        toast.success("Método de pago actualizado");
      } else {
        await createMethod(formData as any);
        toast.success("Método de pago creado");
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast.error("Error al guardar el método de pago");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingMethod ? "Editar" : "Nuevo"} Método de Pago
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ej: Bizum, Transferencia Bancaria..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type || "bizum"}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bizum">Bizum</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Transferencia</SelectItem>
                  <SelectItem value="cash">Efectivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="display_order">Orden</Label>
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact_phone">Teléfono (opcional)</Label>
            <Input
              id="contact_phone"
              value={formData.contact_phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, contact_phone: e.target.value })
              }
              placeholder="Ej: 600000000"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact_email">Email (opcional)</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email || ""}
              onChange={(e) =>
                setFormData({ ...formData, contact_email: e.target.value })
              }
              placeholder="ejemplo@email.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bank_account">Cuenta Bancaria (opcional)</Label>
            <Input
              id="bank_account"
              value={formData.bank_account || ""}
              onChange={(e) =>
                setFormData({ ...formData, bank_account: e.target.value })
              }
              placeholder="IBAN..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="instructions">Instrucciones</Label>
            <Textarea
              id="instructions"
              value={formData.instructions || ""}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              placeholder="Explica cómo realizar el pago..."
              className="h-24"
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingMethod ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
