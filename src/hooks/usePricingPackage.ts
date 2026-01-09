import { useEffect } from "react";
import { usePricingPackageStore } from "@/stores";
import type { Database } from "@/types/database";

type PricingPackageInsert =
  Database["public"]["Tables"]["pricing_packages"]["Insert"];
type PricingPackageUpdate =
  Database["public"]["Tables"]["pricing_packages"]["Update"];

export function usePricingPackage(loadAll = false) {
  const {
    items: packages,
    activePackages,
    isLoading,
    error,
    fetchAll,
    fetchActive,
    create,
    update,
    delete: deleteItem,
    toggleActive,
  } = usePricingPackageStore();

  useEffect(() => {
    if (loadAll) {
      fetchAll();
    } else {
      fetchActive();
    }
  }, [loadAll, fetchAll, fetchActive]);

  const handleCreate = async (pricingPackage: PricingPackageInsert) => {
    return create(pricingPackage);
  };

  const handleUpdate = async (id: string, updates: PricingPackageUpdate) => {
    return update(id, updates);
  };

  const handleDelete = async (id: string) => {
    return deleteItem(id);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    return toggleActive(id, isActive);
  };

  const refreshPackages = () => {
    return fetchAll(true);
  };

  const refreshActivePackages = () => {
    // BaseStore fetchActive doesn't take force yet, but we optimized it to check cache.
    // If we want to refresh, we should clear cache or allow force.
    // For now, let's just make fetchAll force reload which populates active too if initialized.
    return fetchAll(true);
  };

  return {
    packages: loadAll ? packages : activePackages,
    isLoading,
    error,
    createPackage: handleCreate,
    updatePackage: handleUpdate,
    deletePackage: handleDelete,
    toggleActive: handleToggleActive,
    refreshPackages,
    refreshActivePackages,
  };
}
