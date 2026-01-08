import { create } from "zustand";
import { pricingPackageService } from "@/services";
import type { Database } from "@/types/database";

type PricingPackage = Database["public"]["Tables"]["pricing_packages"]["Row"];
type PricingPackageInsert =
  Database["public"]["Tables"]["pricing_packages"]["Insert"];
type PricingPackageUpdate =
  Database["public"]["Tables"]["pricing_packages"]["Update"];

interface PricingPackageStore {
  packages: PricingPackage[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;

  fetchPackages: () => Promise<void>;
  fetchActivePackages: () => Promise<void>;
  createPackage: (
    pricingPackage: PricingPackageInsert
  ) => Promise<PricingPackage>;
  updatePackage: (
    id: string,
    updates: PricingPackageUpdate
  ) => Promise<PricingPackage>;
  deletePackage: (id: string) => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  setError: (error: string | null) => void;
}

export const usePricingPackageStore = create<PricingPackageStore>(
  (set, get) => ({
    packages: [],
    isLoading: false,
    error: null,
    initialized: false,

    fetchPackages: async () => {
      set({ isLoading: true, error: null });
      try {
        const packages = await pricingPackageService.getAll();
        set({ packages, isLoading: false, initialized: true });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Error fetching pricing packages",
          isLoading: false,
          initialized: true,
        });
      }
    },

    fetchActivePackages: async () => {
      set({ isLoading: true, error: null });
      try {
        const packages = await pricingPackageService.getActive();
        set({ packages, isLoading: false, initialized: true });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Error fetching active packages",
          isLoading: false,
          initialized: true,
        });
      }
    },

    createPackage: async (pricingPackage) => {
      set({ isLoading: true, error: null });
      try {
        const newPackage = await pricingPackageService.create(pricingPackage);
        set({
          packages: [...get().packages, newPackage],
          isLoading: false,
        });
        return newPackage;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error creating pricing package";
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    updatePackage: async (id, updates) => {
      set({ isLoading: true, error: null });
      try {
        const updatedPackage = await pricingPackageService.update(id, updates);
        set({
          packages: get().packages.map((pkg) =>
            pkg.id === id ? updatedPackage : pkg
          ),
          isLoading: false,
        });
        return updatedPackage;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error updating pricing package";
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    deletePackage: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await pricingPackageService.delete(id);
        set({
          packages: get().packages.filter((pkg) => pkg.id !== id),
          isLoading: false,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error deleting pricing package";
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    toggleActive: async (id, isActive) => {
      await get().updatePackage(id, { is_active: isActive });
    },

    setError: (error) => set({ error }),
  })
);
