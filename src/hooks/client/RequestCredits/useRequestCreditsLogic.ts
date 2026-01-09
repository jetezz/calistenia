import { useEffect, useCallback } from "react";
import { usePricingPackageStore } from "@/stores/pricingPackageStore";
import { usePaymentMethodStore } from "@/stores/paymentMethodStore";
import { usePaymentRequestStore } from "@/stores/paymentRequestStore";
import type { Database } from "@/types/database";

type PaymentRequestInsert =
  Database["public"]["Tables"]["payment_requests"]["Insert"];

export const useRequestCreditsLogic = () => {
  // Stores
  const {
    activePackages,
    isLoading: isLoadingPackages,
    fetchActive: fetchActivePackages,
  } = usePricingPackageStore();

  const {
    activeMethods,
    isLoading: isLoadingMethods,
    fetchActive: fetchActiveMethods,
  } = usePaymentMethodStore();

  const { create: createPaymentRequest, isLoading: isCreating } =
    usePaymentRequestStore();

  // Initial fetch
  useEffect(() => {
    fetchActivePackages();
    fetchActiveMethods();
  }, [fetchActivePackages, fetchActiveMethods]);

  // Create payment request
  const submitRequest = useCallback(
    async (requestData: PaymentRequestInsert) => {
      return await createPaymentRequest(requestData);
    },
    [createPaymentRequest]
  );

  // Refresh data
  const refresh = useCallback(() => {
    fetchActivePackages();
    fetchActiveMethods();
  }, [fetchActivePackages, fetchActiveMethods]);

  return {
    // Data
    packages: activePackages,
    methods: activeMethods,

    // UI State
    isLoading: isLoadingPackages || isLoadingMethods,
    isSubmitting: isCreating,

    // Actions
    submitRequest,
    refresh,
  };
};
