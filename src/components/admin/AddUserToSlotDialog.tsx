import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfileStore } from "@/stores/profileStore";
import { useBookingStore } from "@/stores/bookingStore";
import { toast } from "sonner";

interface AddUserToSlotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  slotId: string;
  bookingDate: string;
  slotTime: string;
}

export function AddUserToSlotDialog({
  isOpen,
  onClose,
  onSuccess,
  slotId,
  bookingDate,
  slotTime,
}: AddUserToSlotDialogProps) {
  const { items: profiles, fetchAll: fetchProfiles } = useProfileStore();
  const { create: createBooking } = useBookingStore();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchProfiles();
    }
  }, [isOpen, fetchProfiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Selecciona un usuario");
      return;
    }

    try {
      await createBooking({
        user_id: selectedUserId,
        time_slot_id: slotId,
        booking_date: bookingDate,
        status: "confirmed",
      });
      toast.success("Usuario añadido con éxito");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding user to slot:", error);
      toast.error("Error al añadir usuario");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Usuario a Clase</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Fecha:</strong> {bookingDate}
            </p>
            <p>
              <strong>Horario:</strong> {slotTime}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="user">Seleccionar Usuario</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Busca un usuario..." />
                </SelectTrigger>
                <SelectContent>
                  {profiles
                    .sort((a, b) =>
                      (a.full_name || "").localeCompare(b.full_name || "")
                    )
                    .map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.full_name || profile.email}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!selectedUserId}>
                Añadir Usuario
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
