import { useState, useMemo, useCallback } from "react";
import { useAdminData, useToast } from "@/hooks";
import { profileService } from "@/services/profileService";

export function useAdminUsers() {
  const {
    profiles: allProfiles,
    isDashboardLoading: isLoading,
    refresh,
  } = useAdminData();

  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const { success, error: showError } = useToast();

  const users = useMemo(() => {
    return allProfiles.filter((profile) => profile.role === "user");
  }, [allProfiles]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        user.payment_status === paymentStatusFilter;

      return matchesSearch && matchesPaymentStatus;
    });
  }, [users, searchQuery, paymentStatusFilter]);

  const updateUserCredits = useCallback(
    async (userId: string, credits: number) => {
      try {
        await profileService.updateCredits(userId, credits);
        success(`Créditos actualizados a ${credits}`);
        await refresh();
      } catch (error) {
        console.error("Error updating user credits:", error);
        showError("Error al actualizar los créditos");
        throw error;
      }
    },
    [success, showError, refresh]
  );

  const updateUserPaymentStatus = useCallback(
    async (userId: string, paymentStatus: string) => {
      try {
        await profileService.updatePaymentStatus(userId, paymentStatus);
        success("Estado de pago actualizado");
        await refresh();
      } catch (error) {
        console.error("Error updating payment status:", error);
        showError("Error al actualizar el estado de pago");
        throw error;
      }
    },
    [success, showError, refresh]
  );

  const createUser = useCallback(
    async (email: string, password: string, fullName: string) => {
      try {
        await profileService.createUser(email, password, fullName);
        success("Usuario creado correctamente");
        await refresh();
      } catch (error) {
        console.error("Error creating user:", error);
        showError("Error al crear el usuario");
        throw error;
      }
    },
    [success, showError, refresh]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      try {
        await profileService.deleteUser(userId);
        success("Usuario eliminado correctamente");
        await refresh();
      } catch (error) {
        console.error("Error deleting user:", error);
        showError("Error al eliminar el usuario");
        throw error;
      }
    },
    [success, showError, refresh]
  );

  return {
    users: filteredUsers,
    allUsers: users,
    isLoading,
    searchQuery,
    setSearchQuery,
    paymentStatusFilter,
    setPaymentStatusFilter,
    refreshUsers: refresh,
    updateUserCredits,
    updateUserPaymentStatus,
    createUser,
    deleteUser,
  };
}
