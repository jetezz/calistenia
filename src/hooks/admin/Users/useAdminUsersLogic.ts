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
  } = useProfileStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Filtrar usuarios normales (role = 'user') usualmente, pero si es admin page listamos todos
  // o solo clientes? Normalmente los admins gestionan clientes.
  // Asumiremos que listamos todos y filtramos en UI o aquí.
  const users = profiles.filter((p) => !p.role || p.role === "user");

  return {
    users, // or profiles if we want to show admins too
    isLoading,
    error,
    refresh: fetchAll,
    createUser,
    deleteUser,
    updateCredits,
    updatePaymentStatus,
  };
};
