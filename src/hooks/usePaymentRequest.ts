import { useCallback, useMemo } from "react";
import { usePaymentRequestStore } from "@/stores";
import type { Database } from "@/types/database";

type PaymentRequestInsert =
  Database["public"]["Tables"]["payment_requests"]["Insert"];
type PaymentRequestUpdate =
  Database["public"]["Tables"]["payment_requests"]["Update"];

export const usePaymentRequest = () => {
  const {
    items: paymentRequests,
    isLoading: loading,
    error,
    fetchAll,
    create,
    update,
    delete: deleteRequest,
    approve,
    reject,
  } = usePaymentRequestStore();

  const pendingPaymentRequests = useMemo(
    () => paymentRequests.filter((r) => r.status === "pending"),
    [paymentRequests]
  );

  const fetchPaymentRequests = useCallback(async () => {
    await fetchAll();
  }, [fetchAll]);

  const createPaymentRequest = useCallback(
    async (requestData: PaymentRequestInsert) => {
      return await create(requestData);
    },
    [create]
  );

  const approvePaymentRequest = useCallback(
    async (id: string, processedBy: string, adminNotes?: string) => {
      return await approve(id, processedBy, adminNotes);
    },
    [approve]
  );

  const rejectPaymentRequest = useCallback(
    async (id: string, processedBy: string, adminNotes?: string) => {
      return await reject(id, processedBy, adminNotes);
    },
    [reject]
  );

  return {
    // State
    paymentRequests,
    pendingPaymentRequests,
    loading,
    error,

    // Actions
    fetchPaymentRequests,
    createPaymentRequest,
    updatePaymentRequest: update,
    approvePaymentRequest,
    rejectPaymentRequest,
    deletePaymentRequest: deleteRequest,
  };
};
