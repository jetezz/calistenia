import { useEffect } from "react";
import { usePaymentMethodStore } from "@/stores/paymentMethodStore";

export const usePaymentInfoLogic = () => {
  // Stores
  const {
    activeMethods,
    isLoading,
    fetchActive: fetchActiveMethods,
  } = usePaymentMethodStore();

  // Initial fetch
  useEffect(() => {
    fetchActiveMethods();
  }, [fetchActiveMethods]);

  // Refresh data
  const refresh = () => {
    fetchActiveMethods(true);
  };

  return {
    // Data
    methods: activeMethods,

    // UI State
    isLoading,

    // Actions
    refresh,
  };
};
