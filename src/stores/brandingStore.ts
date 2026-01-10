import { create } from "zustand";
import { brandingService } from "@/services/brandingService";
import type {
  BrandingSettings,
  BrandingSettingsUpdate,
  ImageType,
} from "@/types/branding";

interface BrandingStore {
  // State
  settings: BrandingSettings | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: BrandingSettingsUpdate) => Promise<void>;
  uploadImage: (file: File, type: ImageType) => Promise<string>;
  reset: () => void;
}

const initialState = {
  settings: null,
  isLoading: false,
  error: null,
};

export const useBrandingStore = create<BrandingStore>((set, get) => ({
  ...initialState,

  /**
   * Fetch branding settings from the database
   */
  fetchSettings: async () => {
    set({ isLoading: true, error: null });

    try {
      const settings = await brandingService.getBrandingSettings();
      set({ settings, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al cargar la configuración";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Update branding settings
   */
  updateSettings: async (updates: BrandingSettingsUpdate) => {
    set({ isLoading: true, error: null });

    try {
      const updatedSettings = await brandingService.updateBrandingSettings(
        updates
      );
      set({ settings: updatedSettings, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar la configuración";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Upload an image and update the corresponding field
   * Deletes the old image before uploading the new one
   */
  uploadImage: async (file: File, type: ImageType): Promise<string> => {
    set({ isLoading: true, error: null });

    try {
      const currentSettings = get().settings;

      // Map image type to field name
      const fieldMap: Record<ImageType, keyof BrandingSettingsUpdate> = {
        logo: "logo_url",
        hero: "hero_image_url",
        trainer: "trainer_image_url",
        group: "group_image_url",
      };

      const field = fieldMap[type];

      // Get the old image URL
      const oldImageUrl = currentSettings?.[field as keyof BrandingSettings] as
        | string
        | null;

      // Delete old image if it exists and is from Supabase Storage (not a default image)
      if (
        oldImageUrl &&
        oldImageUrl.includes("/storage/v1/object/public/branding/")
      ) {
        try {
          const oldPath = brandingService.getImagePathFromUrl(oldImageUrl);
          if (oldPath) {
            await brandingService.deleteImage(oldPath);
          }
        } catch (deleteError) {
          // Log error but don't fail the upload
          console.warn("Failed to delete old image:", deleteError);
        }
      }

      // Upload new image
      const { url } = await brandingService.uploadImage(file, type);

      // Update settings with new image URL
      await get().updateSettings({ [field]: url });

      set({ isLoading: false });
      return url;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al subir la imagen";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  /**
   * Reset store to initial state
   */
  reset: () => {
    set(initialState);
  },
}));
