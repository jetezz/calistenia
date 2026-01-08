import { create } from "zustand";
import { paymentMethodService } from "@/services";
import type { Database } from "@/types/database";

type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];
type PaymentMethodInsert =
  Database["public"]["Tables"]["payment_methods"]["Insert"];
type PaymentMethodUpdate =
  Database["public"]["Tables"]["payment_methods"]["Update"];

interface PaymentMethodStore {
  methods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;

  fetchMethods: () => Promise<void>;
  fetchActiveMethods: () => Promise<void>;
  createMethod: (paymentMethod: PaymentMethodInsert) => Promise<PaymentMethod>;
  updateMethod: (
    id: string,
    updates: PaymentMethodUpdate
  ) => Promise<PaymentMethod>;
  deleteMethod: (id: string) => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  setError: (error: string | null) => void;
}

export const usePaymentMethodStore = create<PaymentMethodStore>((set, get) => ({
  methods: [],
  isLoading: false,
  error: null,
  initialized: false,

  fetchMethods: async () => {
    set({ isLoading: true, error: null });
    try {
      const methods = await paymentMethodService.getAll();
      set({ methods, isLoading: false, initialized: true });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error fetching payment methods",
        isLoading: false,
        initialized: true,
      });
    }
  },

  fetchActiveMethods: async () => {
    set({ isLoading: true, error: null });
    try {
      const methods = await paymentMethodService.getActive();
      set({ methods, isLoading: false, initialized: true });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error fetching active methods",
        isLoading: false,
        initialized: true,
      });
    }
  },

  createMethod: async (paymentMethod) => {
    set({ isLoading: true, error: null });
    try {
      const newMethod = await paymentMethodService.create(paymentMethod);
      set({
        methods: [...get().methods, newMethod],
        isLoading: false,
      });
      return newMethod;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error creating payment method";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateMethod: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedMethod = await paymentMethodService.update(id, updates);
      set({
        methods: get().methods.map((method) =>
          method.id === id ? updatedMethod : method
        ),
        isLoading: false,
      });
      return updatedMethod;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error updating payment method";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteMethod: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await paymentMethodService.delete(id);
      set({
        methods: get().methods.filter((method) => method.id !== id),
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error deleting payment method";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  toggleActive: async (id, isActive) => {
    await get().updateMethod(id, { is_active: isActive });
  },

  setError: (error) => set({ error }),
}));
