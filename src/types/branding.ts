// Branding Settings Types
// Defines all types for the branding configuration system

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  visible: boolean;
}

export interface BrandingSettings {
  id: string;

  // Identidad de Marca
  business_name: string;
  logo_url: string | null;
  show_logo: boolean;

  // Imágenes
  hero_image_url: string | null;
  trainer_image_url: string | null;
  group_image_url: string | null;
  show_hero_image: boolean;
  show_trainer_image: boolean;
  show_group_image: boolean;

  // Información de Contacto
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  show_email: boolean;
  show_phone: boolean;
  show_whatsapp: boolean;
  show_instagram: boolean;

  // Ubicación
  address: string | null;
  city: string;
  region: string;
  country: string;
  google_maps_url: string | null;
  latitude: number | null;
  longitude: number | null;
  show_location: boolean;

  // Horarios
  schedule_weekdays: string | null;
  schedule_saturday: string | null;
  schedule_sunday: string | null;
  show_schedule: boolean;

  // Textos de Landing Page - Hero Section
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;

  // Textos - Propuesta de Valor
  value_prop_title: string;
  value_prop_subtitle: string | null;

  // Textos - Sobre el Entrenador
  about_trainer_title: string | null;
  about_trainer_text: string | null;
  about_trainer_quote: string | null;

  // Textos - Sección de Empatía
  empathy_title: string | null;
  empathy_subtitle: string | null;

  // Textos - CTA Final
  final_cta_title: string | null;
  final_cta_subtitle: string | null;

  // Testimonios
  testimonials: Testimonial[];

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface BrandingSettingsUpdate {
  // Identidad de Marca
  business_name?: string;
  logo_url?: string | null;
  show_logo?: boolean;

  // Imágenes
  hero_image_url?: string | null;
  trainer_image_url?: string | null;
  group_image_url?: string | null;
  show_hero_image?: boolean;
  show_trainer_image?: boolean;
  show_group_image?: boolean;

  // Información de Contacto
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  show_email?: boolean;
  show_phone?: boolean;
  show_whatsapp?: boolean;
  show_instagram?: boolean;

  // Ubicación
  address?: string | null;
  city?: string;
  region?: string;
  country?: string;
  google_maps_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  show_location?: boolean;

  // Horarios
  schedule_weekdays?: string | null;
  schedule_saturday?: string | null;
  schedule_sunday?: string | null;
  show_schedule?: boolean;

  // Textos de Landing Page
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_text?: string;
  value_prop_title?: string;
  value_prop_subtitle?: string | null;
  about_trainer_title?: string | null;
  about_trainer_text?: string | null;
  about_trainer_quote?: string | null;
  empathy_title?: string | null;
  empathy_subtitle?: string | null;
  final_cta_title?: string | null;
  final_cta_subtitle?: string | null;

  // Testimonios
  testimonials?: Testimonial[];
}

export type ImageType = "logo" | "hero" | "trainer" | "group";

export interface ImageUploadResult {
  url: string;
  path: string;
}
