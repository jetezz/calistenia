import { create } from "zustand";
import { createBaseStore, type BaseStoreState } from "./BaseStore";
import { paymentRequestService } from "@/services/paymentRequestService";
import type { Database } from "@/types/database";

type PaymentRequest = Database["public"]["Tables"]["payment_requests"]["Row"];
type PaymentRequestInsert =
  Database["public"]["Tables"]["payment_requests"]["Insert"];
type PaymentRequestUpdate =
  Database["public"]["Tables"]["payment_requests"]["Update"];

type PaymentRequestWithRelations = PaymentRequest & {
  user: { id: string; full_name: string | null; email: string } | null;
};

interface PaymentRequestStore
  extends BaseStoreState<
    PaymentRequestWithRelations,
    PaymentRequestInsert,
    PaymentRequestUpdate
  > {
  approve: (id: string, processedBy: string, notes?: string) => Promise<void>;
  reject: (id: string, processedBy: string, notes?: string) => Promise<void>;
}

export const usePaymentRequestStore = create<PaymentRequestStore>(
  (set, get, store) => {
    const baseStore = createBaseStore<
      PaymentRequestWithRelations,
      PaymentRequestInsert,
      PaymentRequestUpdate
    >(paymentRequestService)(set, get, store);

    return {
      ...baseStore,
      approve: async (id, processedBy, notes) => {
        // Optimistic update
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, status: "approved" } : i
          ),
        }));

        try {
          await paymentRequestService.approve(id, processedBy, notes);
          // Podríamos actualizar con la respuesta real si trae datos extra como fecha procesado
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e));
          set({ error: error.message }); // Deberíamos revertir idealmente
        }
      },
      reject: async (id, processedBy, notes) => {
        // Optimistic update
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, status: "rejected" } : i
          ),
        }));

        try {
          await paymentRequestService.reject(id, processedBy, notes);
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e));
          set({ error: error.message });
        }
      },
    };
  }
);
