import { create } from "zustand";
import { createBaseStore, type BaseStoreState } from "./BaseStore";
import { pricingPackageService } from "@/services/pricingPackageService";
import type { Database } from "@/types/database";

type PricingPackage = Database["public"]["Tables"]["pricing_packages"]["Row"];
type PricingPackageInsert =
  Database["public"]["Tables"]["pricing_packages"]["Insert"];
type PricingPackageUpdate =
  Database["public"]["Tables"]["pricing_packages"]["Update"];

interface PricingPackageStore
  extends BaseStoreState<
    PricingPackage,
    PricingPackageInsert,
    PricingPackageUpdate
  > {
  activePackages: PricingPackage[];
  fetchActive: () => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  updateDisplayOrder: (id: string, order: number) => Promise<void>;
}

export const usePricingPackageStore = create<PricingPackageStore>(
  (set, get, store) => {
    const baseStore = createBaseStore<
      PricingPackage,
      PricingPackageInsert,
      PricingPackageUpdate
    >(pricingPackageService)(set, get, store);

    return {
      ...baseStore,
      activePackages: [], // Explicitly type if needed, but [] is inferred as never[] initially which is fine for empty

      fetchActive: async () => {
        // Cache check not strictly necessary if fetchAll handles it, but good for skipping logic
        if (get().isInitialized) {
          set({ activePackages: get().items.filter((p) => p.is_active) });
          return;
        }

        // Consolidate to fetchAll which is deduped
        await get().fetchAll();
        set({ activePackages: get().items.filter((p) => p.is_active) });
      },

      toggleActive: async (id, isActive) => {
        // Optimistic
        set((state) => ({
          items: state.items.map((p) =>
            p.id === id ? { ...p, is_active: isActive } : p
          ),
        }));

        try {
          await pricingPackageService.toggleActive(id, isActive);
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e));
          set({ error: error.message });
          // Revert logic would go here
        }
      },

      updateDisplayOrder: async (id, order) => {
        // Optimistic
        set((state) => ({
          items: state.items
            .map((p) => (p.id === id ? { ...p, display_order: order } : p))
            .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
        }));

        try {
          await pricingPackageService.updateDisplayOrder(id, order);
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e));
          set({ error: error.message });
        }
      },
    };
  }
);
