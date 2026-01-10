import { useEffect } from "react";
import { usePaymentMethodStore } from "@/stores/paymentMethodStore";
import type { Database } from "@/types/database";

type PaymentMethodInsert =
  Database["public"]["Tables"]["payment_methods"]["Insert"];
type PaymentMethodUpdate =
  Database["public"]["Tables"]["payment_methods"]["Update"];

export const useAdminPaymentMethodsLogic = () => {
  const {
    items: methods,
    isLoading,
    error,
    fetchAll,
    create: createMethod,
    update: updateMethod,
    delete: deleteMethod,
    toggleActive,
    updateDisplayOrder,
  } = usePaymentMethodStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreateMethod = async (data: PaymentMethodInsert) => {
    await createMethod(data);
  };

  const handleUpdateMethod = async (id: string, data: PaymentMethodUpdate) => {
    await updateMethod(id, data);
  };

  const handleDeleteMethod = async (id: string) => {
    await deleteMethod(id);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleActive(id, isActive);
  };

  const handleUpdateDisplayOrder = async (id: string, order: number) => {
    await updateDisplayOrder(id, order);
  };

  return {
    methods,
    isLoading,
    error,
    refresh: () => fetchAll(true),
    createMethod: handleCreateMethod,
    updateMethod: handleUpdateMethod,
    deleteMethod: handleDeleteMethod,
    toggleActive: handleToggleActive,
    updateDisplayOrder: handleUpdateDisplayOrder,
  };
};
