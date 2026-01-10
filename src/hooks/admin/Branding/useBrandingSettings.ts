import { useEffect } from "react";
import { useBrandingStore } from "@/stores/brandingStore";
import type { BrandingSettingsUpdate, ImageType } from "@/types/branding";

/**
 * Hook for managing branding settings
 * Automatically fetches settings on mount
 */
export function useBrandingSettings() {
  const {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
    uploadImage,
  } = useBrandingStore();

  // Fetch settings on mount
  useEffect(() => {
    if (!settings && !isLoading) {
      fetchSettings();
    }
  }, [settings, isLoading, fetchSettings]);

  /**
   * Update branding settings
   */
  const handleUpdateSettings = async (updates: BrandingSettingsUpdate) => {
    try {
      await updateSettings(updates);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  };

  /**
   * Upload an image
   */
  const handleUploadImage = async (file: File, type: ImageType) => {
    try {
      const url = await uploadImage(file, type);
      return { success: true, url };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  };

  /**
   * Refresh settings from database
   */
  const refresh = async () => {
    try {
      await fetchSettings();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings: handleUpdateSettings,
    uploadImage: handleUploadImage,
    refresh,
  };
}
