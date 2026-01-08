import { useEffect } from "react";
import { usePaymentMethodStore } from "@/stores";
import type { Database } from "@/types/database";

type PaymentMethodInsert =
  Database["public"]["Tables"]["payment_methods"]["Insert"];
type PaymentMethodUpdate =
  Database["public"]["Tables"]["payment_methods"]["Update"];

export function usePaymentMethod(loadAll = false) {
  const {
    methods,
    isLoading,
    error,
    initialized,
    fetchMethods,
    fetchActiveMethods,
    createMethod,
    updateMethod,
    deleteMethod,
    toggleActive,
  } = usePaymentMethodStore();

  useEffect(() => {
    if (!initialized && !isLoading) {
      if (loadAll) {
        fetchMethods();
      } else {
        fetchActiveMethods();
      }
    }
  }, [initialized, isLoading, loadAll, fetchMethods, fetchActiveMethods]);

  const handleCreate = async (paymentMethod: PaymentMethodInsert) => {
    return createMethod(paymentMethod);
  };

  const handleUpdate = async (id: string, updates: PaymentMethodUpdate) => {
    return updateMethod(id, updates);
  };

  const handleDelete = async (id: string) => {
    return deleteMethod(id);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    return toggleActive(id, isActive);
  };

  const refreshMethods = () => {
    return fetchMethods();
  };

  const refreshActiveMethods = () => {
    return fetchActiveMethods();
  };

  return {
    methods,
    isLoading,
    error,
    createMethod: handleCreate,
    updateMethod: handleUpdate,
    deleteMethod: handleDelete,
    toggleActive: handleToggleActive,
    refreshMethods,
    refreshActiveMethods,
  };
}
