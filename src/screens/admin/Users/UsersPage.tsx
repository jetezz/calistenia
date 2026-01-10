import { useState } from "react";
import { Users, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageLoadingState, StandardPage } from "@/components/common";
import { useAdminUsersLogic } from "@/hooks/admin/Users/useAdminUsersLogic";
import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import { UsersFilters } from "@/components/admin/UsersFilters";
import { UserCard } from "@/components/admin/UserCard";

export function UsersPage() {
  const {
    users: allUsers,
    pendingUsers,
    isLoading,
    createUser,
    deleteUser,
    updateCredits,
    updatePaymentStatus,
    approveUser,
    rejectUser,
    updateApprovalStatus,
    refresh,
  } = useAdminUsersLogic();

  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [approvalStatusFilter, setApprovalStatusFilter] = useState("all");
  const [updatingCredits, setUpdatingCredits] = useState<
    Record<string, boolean>
  >({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Filtering logic moved from hook to UI/Logic adaptation
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      (user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (user.email.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesPaymentStatus =
      paymentStatusFilter === "all" ||
      user.payment_status === paymentStatusFilter;

    const matchesApprovalStatus =
      approvalStatusFilter === "all" ||
      user.approval_status === approvalStatusFilter;

    return matchesSearch && matchesPaymentStatus && matchesApprovalStatus;
  });

  // Handlers
  const handleCreateUser = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    await createUser(email, password, fullName);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreditsChange = async (userId: string, change: number) => {
    const user = allUsers.find((u) => u.id === userId);
    if (!user) return;
    const newCredits = Math.max(0, user.credits + change);

    try {
      setUpdatingCredits((prev) => ({ ...prev, [userId]: true }));
      await updateCredits(userId, newCredits);
    } catch (error) {
      console.error("Error updating credits:", error);
    } finally {
      setUpdatingCredits((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (isLoading) {
    return <PageLoadingState message="Cargando usuarios..." />;
  }

  return (
    <StandardPage
      icon={Users}
      title="Usuarios"
      description="Administra los clientes y sus créditos"
      onRefresh={refresh}
      actionButton={
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <UserPlus className="size-4 mr-2" />
          Nuevo
        </Button>
      }
      maxWidth="max-w-4xl"
    >
      <div className="space-y-3">
        <UsersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          paymentStatusFilter={paymentStatusFilter}
          onPaymentStatusChange={setPaymentStatusFilter}
          approvalStatusFilter={approvalStatusFilter}
          onApprovalStatusChange={setApprovalStatusFilter}
        />

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Total: {allUsers.length}</span>
          <span>•</span>
          <span>Mostrando: {filteredUsers.length}</span>
          {pendingUsers.length > 0 && (
            <>
              <span>•</span>
              <span className="text-yellow-600 font-medium">
                {pendingUsers.length} pendiente
                {pendingUsers.length !== 1 ? "s" : ""} de aprobación
              </span>
            </>
          )}
        </div>
      </div>

      {allUsers.length === 0 &&
      searchQuery === "" &&
      paymentStatusFilter === "all" ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No hay usuarios registrados
            </h3>
            <p className="text-sm text-muted-foreground">
              Los nuevos usuarios aparecerán aquí cuando se registren
            </p>
          </CardContent>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No se encontraron usuarios
            </h3>
            <p className="text-sm text-muted-foreground">
              Intenta ajustar los filtros de búsqueda
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isUpdatingCredits={updatingCredits[user.id] || false}
              onCreditsChange={handleCreditsChange}
              onPaymentStatusChange={updatePaymentStatus}
              onApproveUser={approveUser}
              onRejectUser={rejectUser}
              onUpdateApprovalStatus={updateApprovalStatus}
              onDeleteUser={(id, name) => setUserToDelete({ id, name })}
            />
          ))}
        </div>
      )}

      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onUserCreated={handleCreateUser}
      />

      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar a <strong>{userToDelete?.name}</strong>.
              Esta acción no se puede deshacer y eliminará todos los datos
              asociados (reservas, solicitudes de pago, etc.).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StandardPage>
  );
}
