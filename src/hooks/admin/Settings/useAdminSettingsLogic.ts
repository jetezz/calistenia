import { useEffect } from "react";
import { useAppSettingsStore } from "@/stores/appSettingsStore";
import { useAuth } from "@/features/auth";

export const useAdminSettingsLogic = () => {
  const {
    items: settings,
    isLoading,
    error,
    fetchAll,
    updateSettingValue,
  } = useAppSettingsStore();

  const { user } = useAuth();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleUpdateSetting = async (key: string, value: any) => {
    if (!user) return;
    await updateSettingValue(key, value, user.id);
  };

  const handleUpdateCancellationPolicy = async (policy: {
    unit: "hours" | "days";
    value: number;
  }) => {
    if (!user) return;
    await updateSettingValue("cancellation_policy", policy, user.id);
  };

  return {
    settings,
    isLoading,
    error,
    refresh: fetchAll,
    updateSetting: handleUpdateSetting,
    updateCancellationPolicy: handleUpdateCancellationPolicy,
  };
};
