import { useEffect } from "react";
import { usePricingPackageStore } from "@/stores/pricingPackageStore";
import type { Database } from "@/types/database";

type PricingPackageInsert =
  Database["public"]["Tables"]["pricing_packages"]["Insert"];
type PricingPackageUpdate =
  Database["public"]["Tables"]["pricing_packages"]["Update"];

export const useAdminPricingLogic = () => {
  const {
    items: packages,
    isLoading,
    error,
    fetchAll,
    create: createPackage,
    update: updatePackage,
    delete: deletePackage,
    toggleActive,
    updateDisplayOrder,
  } = usePricingPackageStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreatePackage = async (data: PricingPackageInsert) => {
    await createPackage(data);
  };

  const handleUpdatePackage = async (
    id: string,
    data: PricingPackageUpdate
  ) => {
    await updatePackage(id, data);
  };

  const handleDeletePackage = async (id: string) => {
    await deletePackage(id);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleActive(id, isActive);
  };

  const handleUpdateDisplayOrder = async (id: string, order: number) => {
    await updateDisplayOrder(id, order);
  };

  return {
    packages,
    isLoading,
    error,
    refresh: fetchAll,
    createPackage: handleCreatePackage,
    updatePackage: handleUpdatePackage,
    deletePackage: handleDeletePackage,
    toggleActive: handleToggleActive,
    updateDisplayOrder: handleUpdateDisplayOrder,
  };
};
