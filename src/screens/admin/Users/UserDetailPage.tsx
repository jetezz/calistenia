import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  CreditCard,
  Calendar,
  Plus,
  Minus,
  History,
  Settings2,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StandardPage } from "@/components/common";
import { useToast } from "@/hooks";
import { useAdminUserDetailLogic } from "@/hooks/admin/Users/useAdminUserDetailLogic";
import { useWeightStatsStore } from "@/stores/weightStatsStore";
import { AddMeasurementForm } from "@/components/weight-stats/AddMeasurementForm";
import { BiometricsSetupModal } from "@/components/weight-stats/BiometricsSetupModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export function UserDetailPage() {
  const { user, userBookings, isLoading, updateCredits, updatePaymentStatus } =
    useAdminUserDetailLogic();

  const [creditsInput, setCreditsInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddStatOpen, setIsAddStatOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const { success, error: showError } = useToast();

  const { items: weightStats, fetchByUserId } = useWeightStatsStore();

  useEffect(() => {
    if (user) {
      setCreditsInput(user.credits.toString());
      fetchByUserId(user.id, true);
    }
  }, [user, fetchByUserId]);

  const handleUpdateCredits = async (newCredits: number) => {
    if (!user) return;
    try {
      setIsUpdating(true);
      await updateCredits(user.id, newCredits);
      setCreditsInput(newCredits.toString());
      success(`Créditos actualizados a ${newCredits}`);
    } catch (error) {
      console.error("Error updating credits:", error);
      showError("Error al actualizar los créditos");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePaymentStatus = async (status: string) => {
    if (!user) return;
    try {
      await updatePaymentStatus(user.id, status);
      success("Estado de pago actualizado");
    } catch (error) {
      console.error("Error updating payment status:", error);
      showError("Error al actualizar el estado de pago");
    }
  };

  const handleCreditsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCredits = parseInt(creditsInput);
    if (!isNaN(newCredits) && newCredits >= 0) {
      handleUpdateCredits(newCredits);
    }
  };

  // Helper local para renderizado
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 text-white">Al día</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>;
      case "unpaid":
        return <Badge variant="destructive">No pagado</Badge>;
      default:
        return <Badge variant="secondary">Sin definir</Badge>;
    }
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-500 text-white">Confirmada</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>;
      case "completed":
        return <Badge className="bg-green-500 text-white">Completada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!user && !isLoading) {
    return (
      <StandardPage
        icon={User}
        title="Usuario no encontrado"
        maxWidth="max-w-4xl"
      >
        <div className="text-center">
          <Button asChild>
            <Link to="/app/admin/users">
              <ArrowLeft className="size-4 mr-2" />
              Volver a usuarios
            </Link>
          </Button>
        </div>
      </StandardPage>
    );
  }

  return (
    <StandardPage
      icon={User}
      title={user?.full_name || "Detalle de Usuario"}
      description="Gestiona créditos y estado de pago"
      isLoading={isLoading}
      loadingMessage="Cargando datos del usuario..."
      maxWidth="max-w-4xl"
      topActions={
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/app/admin/users">
              <ArrowLeft className="size-4 mr-2" />
              Volver
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfigureOpen(true)}
          >
            <Settings2 className="size-4 mr-2" />
            Configurar
          </Button>
        </div>
      }
      bottomActions={
        <Button size="sm" onClick={() => setIsAddStatOpen(true)}>
          <Plus className="size-4 mr-2" />
          Añadir Estadística
        </Button>
      }
    >
      {user && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="size-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    <AvatarFallback className="text-xl">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-medium">
                        {user.full_name || "Sin nombre"}
                      </h3>
                      {user.role === "admin" && (
                        <Badge
                          variant="outline"
                          className="border-primary text-primary bg-primary/5"
                        >
                          Administrador
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{user.email}</p>
                    {user.phone && (
                      <p className="text-sm text-muted-foreground">
                        {user.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Usuario desde:
                    </span>
                    <span className="text-sm">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Última actualización:
                    </span>
                    <span className="text-sm">
                      {formatDate(user.updated_at)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="size-5" />
                  Gestión de Créditos y Pagos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold mb-1">{user.credits}</div>
                  <div className="text-sm text-muted-foreground">
                    créditos disponibles
                  </div>
                </div>

                <form onSubmit={handleCreditsSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="credits">Establecer créditos</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="credits"
                        type="number"
                        min="0"
                        value={creditsInput}
                        onChange={(e) => setCreditsInput(e.target.value)}
                        placeholder="Número de créditos"
                      />
                      <Button type="submit" disabled={isUpdating}>
                        Actualizar
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleUpdateCredits(Math.max(0, user.credits - 1))
                    }
                    disabled={user.credits === 0 || isUpdating}
                  >
                    <Minus className="size-4 mr-1" />
                    -1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateCredits(user.credits + 1)}
                    disabled={isUpdating}
                  >
                    <Plus className="size-4 mr-1" />
                    +1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateCredits(user.credits + 10)}
                    disabled={isUpdating}
                  >
                    <Plus className="size-4 mr-1" />
                    +10
                  </Button>
                </div>

                <div>
                  <Label htmlFor="payment_status">Estado de pago</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getPaymentStatusBadge(user.payment_status)}
                    <Select
                      value={user.payment_status}
                      onValueChange={handleUpdatePaymentStatus}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin definir</SelectItem>
                        <SelectItem value="paid">Al día</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="unpaid">No pagado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="size-5" />
                Historial de Reservas (últimas 10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="size-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Este usuario no tiene reservas registradas
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userBookings.slice(0, 10).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {formatDate(booking.booking_date)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.time_slot
                            ? `${formatTime(
                                booking.time_slot.start_time
                              )} - ${formatTime(booking.time_slot.end_time)}`
                            : "Horario eliminado"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        {getBookingStatusBadge(booking.status)}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(booking.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-5" />
                Historial de Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weightStats.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="size-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Este usuario no tiene estadísticas registradas
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {weightStats.map((stat) => (
                    <div
                      key={stat.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Fecha
                          </div>
                          <div className="font-medium">
                            {new Date(stat.recorded_at).toLocaleDateString(
                              "es-ES"
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Peso
                          </div>
                          <div className="font-medium">{stat.weight} kg</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Grasa
                          </div>
                          <div className="font-medium">
                            {stat.body_fat_percentage
                              ? `${stat.body_fat_percentage}%`
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Músculo
                          </div>
                          <div className="font-medium">
                            {stat.muscle_mass ? `${stat.muscle_mass} kg` : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={isAddStatOpen} onOpenChange={setIsAddStatOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
              <DialogHeader>
                <DialogTitle>Añadir Nueva Medición</DialogTitle>
                <DialogDescription>
                  Registra métricas de composición corporal para el usuario.
                  Solo el peso es obligatorio.
                </DialogDescription>
              </DialogHeader>
              <AddMeasurementForm
                userId={user.id}
                onSuccess={() => {
                  setIsAddStatOpen(false);
                  fetchByUserId(user.id, true);
                }}
              />
            </DialogContent>
          </Dialog>

          <BiometricsSetupModal
            open={isConfigureOpen}
            onOpenChange={setIsConfigureOpen}
            user={user}
            onComplete={() => {
              // Optionally refresh user data if biometrics are displayed in detail
            }}
          />
        </>
      )}
    </StandardPage>
  );
}
