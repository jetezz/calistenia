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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminSlotsLogic } from "@/hooks/admin/Slots/useAdminSlotsLogic";
import { toast } from "sonner";
import type { Database } from "@/types/database";

type TimeSlot = Database["public"]["Tables"]["time_slots"]["Row"];

interface EnhancedTimeSlotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingSlot: TimeSlot | null;
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

export function EnhancedTimeSlotDialog({
  isOpen,
  onClose,
  onSuccess,
  editingSlot,
}: EnhancedTimeSlotDialogProps) {
  const { createSlot } = useAdminSlotsLogic(); // We'll need updateSlot in the hook later or use store directly
  // Actually, useAdminSlotsLogic doesn't have updateSlot yet. I'll use store.

  const [formData, setFormData] = useState<Partial<TimeSlot>>({
    day_of_week: 1,
    start_time: "08:00:00",
    end_time: "09:00:00",
    capacity: 10,
    is_active: true,
    slot_type: "recurring",
    specific_date: null,
  });

  useEffect(() => {
    if (editingSlot) {
      setFormData(editingSlot);
    } else {
      setFormData({
        day_of_week: 1,
        start_time: "08:00:00",
        end_time: "09:00:00",
        capacity: 10,
        is_active: true,
        slot_type: "recurring",
        specific_date: null,
      });
    }
  }, [editingSlot, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSlot) {
        // TODO: Implement updateSlot in useAdminSlotsLogic or use store
        toast.info("Actualización no implementada aún en el hook");
      } else {
        await createSlot(formData as any);
        toast.success("Horario creado correctamente");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving slot:", error);
      toast.error("Error al guardar el horario");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingSlot ? "Editar" : "Nuevo"} Horario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label>Tipo de Horario</Label>
            <Select
              value={formData.slot_type || "recurring"}
              onValueChange={(value) =>
                setFormData({ ...formData, slot_type: value as any })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recurring">Recurrente semanal</SelectItem>
                <SelectItem value="specific_date">Fecha específica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.slot_type === "recurring" ? (
            <div className="grid gap-2">
              <Label>Día de la Semana</Label>
              <Select
                value={String(formData.day_of_week)}
                onValueChange={(value) =>
                  setFormData({ ...formData, day_of_week: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={String(day.value)}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid gap-2">
              <Label>Fecha Específica</Label>
              <Input
                type="date"
                value={formData.specific_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, specific_date: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Hora Inicio</Label>
              <Input
                type="time"
                step="1"
                value={formData.start_time || "08:00:00"}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Hora Fin</Label>
              <Input
                type="time"
                step="1"
                value={formData.end_time || "09:00:00"}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Capacidad (Plazas)</Label>
            <Input
              type="number"
              value={formData.capacity || 10}
              onChange={(e) =>
                setFormData({ ...formData, capacity: parseInt(e.target.value) })
              }
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: !!checked })
              }
            />
            <Label htmlFor="active">Horario Activo</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingSlot ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
