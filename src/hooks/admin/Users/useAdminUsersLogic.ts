import { useEffect } from "react";
import { useProfileStore } from "@/stores/profileStore";

export const useAdminUsersLogic = () => {
  const {
    items: profiles,
    isLoading,
    error,
    fetchAll,
    createUser,
    deleteUser,
    updateCredits,
    updatePaymentStatus,
    updateApprovalStatus,
    approveUser,
    rejectUser,
    resetAllCredits,
  } = useProfileStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Filtrar usuarios normales (role = 'user') usualmente, pero si es admin page listamos todos
  // o solo clientes? Normalmente los admins gestionan clientes.
  // Asumiremos que listamos todos y filtramos en UI o aquí.
  // Listamos todos los perfiles para que el admin pueda verse y auto-gestionarse
  const users = profiles;

  // Filtrar usuarios por estado de aprobación
  const pendingUsers = users.filter((u) => u.approval_status === "pending");
  const approvedUsers = users.filter((u) => u.approval_status === "approved");
  const rejectedUsers = users.filter((u) => u.approval_status === "rejected");

  return {
    users, // or profiles if we want to show admins too
    pendingUsers,
    approvedUsers,
    rejectedUsers,
    isLoading,
    error,
    refresh: () => fetchAll(true),
    createUser,
    deleteUser,
    updateCredits,
    updatePaymentStatus,
    updateApprovalStatus,
    approveUser,
    rejectUser,
    resetAllCredits,
  };
};
