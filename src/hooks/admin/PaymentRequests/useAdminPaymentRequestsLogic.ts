import { useEffect } from "react";
import { usePaymentRequestStore } from "@/stores/paymentRequestStore";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useAdminPaymentRequestsLogic = () => {
  const {
    items: requests,
    isLoading,
    error,
    fetchAll,
    approve,
    reject,
  } = usePaymentRequestStore();

  const { user } = useAuth();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleApprove = async (id: string, notes?: string) => {
    if (!user) return;
    // Se asume que user.full_name o user.email identifica al que procesa
    const processorId = user.id;
    await approve(id, processorId, notes);
  };

  const handleReject = async (id: string, notes?: string) => {
    if (!user) return;
    const processorId = user.id;
    await reject(id, processorId, notes);
  };

  return {
    requests,
    isLoading,
    error,
    handleApprove,
    handleReject,
    refresh: () => fetchAll(true),
  };
};
