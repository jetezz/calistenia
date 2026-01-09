import { useEffect, useCallback } from "react";
import { useAppSettingsStore } from "@/stores/appSettingsStore";

interface CancellationPolicy {
  unit: "hours" | "days";
  value: number;
}

export function useAppSettings() {
  const {
    items: settings,
    isLoading: loading,
    error,
    fetchAll: fetchSettings,
    getSettingValue,
    updateSettingValue,
  } = useAppSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getCancellationPolicy = useCallback((): CancellationPolicy | null => {
    return getSettingValue<CancellationPolicy | null>(
      "cancellation_policy",
      null
    );
  }, [getSettingValue]);

  const updateCancellationPolicy = async (
    policy: CancellationPolicy,
    userId: string
  ) => {
    await updateSettingValue("cancellation_policy", policy, userId);
  };

  return {
    settings,
    cancellationPolicy: getCancellationPolicy(),
    loading,
    error,
    fetchSettings,
    updateCancellationPolicy,
    getCancellationPolicy,
  };
}
