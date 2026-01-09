import { create } from "zustand";
import { createBaseStore, type BaseStoreState } from "./BaseStore";
import { paymentMethodService } from "@/services/paymentMethodService";
import type { Database } from "@/types/database";

type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];
type PaymentMethodInsert =
  Database["public"]["Tables"]["payment_methods"]["Insert"];
type PaymentMethodUpdate =
  Database["public"]["Tables"]["payment_methods"]["Update"];

interface PaymentMethodStore
  extends BaseStoreState<
    PaymentMethod,
    PaymentMethodInsert,
    PaymentMethodUpdate
  > {
  activeMethods: PaymentMethod[];
  fetchActive: () => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  updateDisplayOrder: (id: string, order: number) => Promise<void>;
}

export const usePaymentMethodStore = create<PaymentMethodStore>(
  (set, get, store) => {
    const baseStore = createBaseStore<
      PaymentMethod,
      PaymentMethodInsert,
      PaymentMethodUpdate
    >(paymentMethodService)(set, get, store);

    return {
      ...baseStore,
      activeMethods: [],

      fetchActive: async () => {
        // Cache check
        if (get().isInitialized) {
          set({ activeMethods: get().items.filter((m) => m.is_active) });
          return;
        }

        // Consolidate to fetchAll which is deduped
        await get().fetchAll();
        set({ activeMethods: get().items.filter((m) => m.is_active) });
      },

      toggleActive: async (id, isActive) => {
        // Optimistic
        set((state) => ({
          items: state.items.map((p) =>
            p.id === id ? { ...p, is_active: isActive } : p
          ),
        }));

        try {
          await paymentMethodService.toggleActive(id, isActive);
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e));
          set({ error: error.message });
        }
      },

      updateDisplayOrder: async (id, order) => {
        set((state) => ({
          items: state.items
            .map((p) => (p.id === id ? { ...p, display_order: order } : p))
            .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
        }));

        try {
          await paymentMethodService.updateDisplayOrder(id, order);
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e));
          set({ error: error.message });
        }
      },
    };
  }
);
