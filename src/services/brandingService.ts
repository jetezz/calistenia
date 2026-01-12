import { supabase } from "@/lib/supabase";
import type {
  BrandingSettings,
  BrandingSettingsUpdate,
  ImageType,
  ImageUploadResult,
} from "@/types/branding";

/**
 * Service for managing branding settings
 */
export const brandingService = {
  /**
   * Get the current branding settings
   * Returns the first (and should be only) row from branding_settings table
   */
  async getBrandingSettings(): Promise<BrandingSettings | null> {
    const { data, error } = await supabase
      .from("branding_settings")
      .select("*")
      .single();

    if (error) {
      // If no settings exist yet, return null
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Error fetching branding settings: ${error.message}`);
    }

    return data as unknown as BrandingSettings;
  },

  /**
   * Update branding settings
   * If no settings exist, creates a new row
   */
  async updateBrandingSettings(
    updates: BrandingSettingsUpdate
  ): Promise<BrandingSettings> {
    // First, check if settings exist
    const existing = await this.getBrandingSettings();

    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from("branding_settings")
        .update(updates as any)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating branding settings: ${error.message}`);
      }

      return data as unknown as BrandingSettings;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from("branding_settings")
        .insert(updates as any)
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating branding settings: ${error.message}`);
      }

      return data as unknown as BrandingSettings;
    }
  },

  /**
   * Upload an image to Supabase Storage
   * @param file - The image file to upload
   * @param type - The type of image (logo, hero, trainer, group)
   * @returns The public URL of the uploaded image
   */
  async uploadImage(file: File, type: ImageType): Promise<ImageUploadResult> {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("El archivo debe ser una imagen");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("La imagen no puede superar los 5MB");
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${type}-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage (branding bucket)
    const { error: uploadError } = await supabase.storage
      .from("branding")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Error al subir la imagen: ${uploadError.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("branding").getPublicUrl(fileName);

    return {
      url: publicUrl,
      path: fileName,
    };
  },

  /**
   * Delete an image from Supabase Storage
   * @param path - The path of the image to delete
   */
  async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage.from("branding").remove([path]);

    if (error) {
      throw new Error(`Error al eliminar la imagen: ${error.message}`);
    }
  },

  /**
   * Get the image path from a public URL
   * @param url - The public URL
   * @returns The storage path
   */
  getImagePathFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/branding/");
      return pathParts[1] || null;
    } catch {
      return null;
    }
  },
};
