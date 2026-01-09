import { useEffect } from "react";
import { usePaymentMethodStore } from "@/stores";
import type { Database } from "@/types/database";

type PaymentMethodInsert =
  Database["public"]["Tables"]["payment_methods"]["Insert"];
type PaymentMethodUpdate =
  Database["public"]["Tables"]["payment_methods"]["Update"];

export function usePaymentMethod(loadAll = false) {
  const {
    items: methods,
    activeMethods,
    isLoading,
    error,
    fetchAll,
    fetchActive,
    create,
    update,
    delete: deleteItem,
    toggleActive,
  } = usePaymentMethodStore();

  useEffect(() => {
    if (loadAll) {
      fetchAll();
    } else {
      fetchActive();
    }
  }, [loadAll, fetchAll, fetchActive]);

  const handleCreate = async (paymentMethod: PaymentMethodInsert) => {
    return create(paymentMethod);
  };

  const handleUpdate = async (id: string, updates: PaymentMethodUpdate) => {
    return update(id, updates);
  };

  const handleDelete = async (id: string) => {
    return deleteItem(id);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    return toggleActive(id, isActive);
  };

  const refreshMethods = () => {
    return fetchAll();
  };

  const refreshActiveMethods = () => {
    return fetchActive();
  };

  return {
    methods: loadAll ? methods : activeMethods,
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
