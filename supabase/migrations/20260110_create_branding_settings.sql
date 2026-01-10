-- Migration: Create branding_settings table
-- Description: Stores all customizable branding and contact information for the application
-- Author: System
-- Date: 2026-01-10

-- Create branding_settings table
CREATE TABLE IF NOT EXISTS branding_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identidad de Marca
  business_name TEXT NOT NULL DEFAULT 'Calistenia Emérita',
  logo_url TEXT,
  show_logo BOOLEAN NOT NULL DEFAULT true,
  
  -- Imágenes
  hero_image_url TEXT,
  trainer_image_url TEXT,
  group_image_url TEXT,
  show_hero_image BOOLEAN NOT NULL DEFAULT true,
  show_trainer_image BOOLEAN NOT NULL DEFAULT true,
  show_group_image BOOLEAN NOT NULL DEFAULT true,
  
  -- Información de Contacto
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  show_email BOOLEAN NOT NULL DEFAULT true,
  show_phone BOOLEAN NOT NULL DEFAULT true,
  show_whatsapp BOOLEAN NOT NULL DEFAULT true,
  show_instagram BOOLEAN NOT NULL DEFAULT true,
  
  -- Ubicación
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Mérida',
  region TEXT NOT NULL DEFAULT 'Extremadura',
  country TEXT NOT NULL DEFAULT 'España',
  google_maps_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  show_location BOOLEAN NOT NULL DEFAULT true,
  
  -- Horarios
  schedule_weekdays TEXT DEFAULT 'Lunes - Viernes: 7:00 - 21:00',
  schedule_saturday TEXT DEFAULT 'Sábados: 9:00 - 14:00',
  schedule_sunday TEXT DEFAULT 'Domingos: Cerrado',
  show_schedule BOOLEAN NOT NULL DEFAULT true,
  
  -- Textos de Landing Page - Hero Section
  hero_title TEXT NOT NULL DEFAULT 'Recupera tu agilidad y fuerza sin el ambiente de un gimnasio tradicional',
  hero_subtitle TEXT NOT NULL DEFAULT 'Entrenamiento personal en grupos reducidos (máximo 4 personas) en Mérida. Especialistas en salud, movilidad y calistenia para mayores de 40.',
  hero_cta_text TEXT NOT NULL DEFAULT 'Solicitar Entrevista Gratuita',
  
  -- Textos - Propuesta de Valor
  value_prop_title TEXT NOT NULL DEFAULT 'Nuestra Solución',
  value_prop_subtitle TEXT DEFAULT 'Un enfoque personalizado que prioriza tu salud y bienestar',
  
  -- Textos - Sobre el Entrenador
  about_trainer_title TEXT DEFAULT 'Tu Entrenador Personal',
  about_trainer_text TEXT DEFAULT 'Con años de experiencia en entrenamiento funcional y calistenia, mi enfoque está en el acompañamiento personal y la creación de una verdadera comunidad.',
  about_trainer_quote TEXT DEFAULT 'No eres un número, eres parte de la familia.',
  
  -- Textos - Sección de Empatía
  empathy_title TEXT DEFAULT '¿Te suena esto?',
  empathy_subtitle TEXT DEFAULT 'Entendemos que no buscas un cuerpo de revista, sino atarte los cordones sin dolor',
  
  -- Textos - CTA Final
  final_cta_title TEXT DEFAULT 'Únete al grupo',
  final_cta_subtitle TEXT DEFAULT 'Solo 4 plazas por hora. No esperes más para cuidar tu salud.',
  
  -- Testimonios (JSON array)
  testimonials JSONB DEFAULT '[
    {
      "id": "1",
      "name": "María, 47 años",
      "role": "Funcionaria pública",
      "text": "Después de años con dolor de espalda, finalmente puedo jugar con mis hijos sin molestias. El ambiente es familiar y nunca me he sentido juzgada.",
      "visible": true
    },
    {
      "id": "2",
      "name": "Carlos, 52 años",
      "role": "Administrativo",
      "text": "Los grupos pequeños hacen toda la diferencia. El entrenador está siempre pendiente y he recuperado movilidad que creía perdida.",
      "visible": true
    },
    {
      "id": "3",
      "name": "Ana, 44 años",
      "role": "Profesora",
      "text": "Nunca me gustaron los gimnasios grandes. Aquí me siento cómoda y segura. Es como entrenar con amigos.",
      "visible": true
    }
  ]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on updated_at for performance
CREATE INDEX idx_branding_settings_updated_at ON branding_settings(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read branding settings (needed for public landing page)
CREATE POLICY "Anyone can read branding settings"
ON branding_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy: Only admins can insert branding settings
CREATE POLICY "Only admins can insert branding settings"
ON branding_settings
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Only admins can update branding settings
CREATE POLICY "Only admins can update branding settings"
ON branding_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Only admins can delete branding settings
CREATE POLICY "Only admins can delete branding settings"
ON branding_settings
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_branding_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER trigger_update_branding_settings_updated_at
BEFORE UPDATE ON branding_settings
FOR EACH ROW
EXECUTE FUNCTION update_branding_settings_updated_at();

-- Insert default branding settings (only if table is empty)
INSERT INTO branding_settings (
  business_name,
  email,
  phone,
  whatsapp,
  instagram,
  address,
  city,
  region,
  country,
  latitude,
  longitude,
  hero_image_url,
  trainer_image_url,
  group_image_url
)
SELECT
  'Calistenia Emérita',
  'info@calisteniaemérita.com',
  '+34 XXX XXX XXX',
  '34XXXXXXXXX',
  '@calisteniaemérita',
  'Calle Ejemplo, 123',
  'Mérida',
  'Extremadura',
  'España',
  38.9167,
  -6.3333,
  '/hero-background.png',
  '/trainer-photo.png',
  '/group-training.png'
WHERE NOT EXISTS (SELECT 1 FROM branding_settings);

-- Add comment to table
COMMENT ON TABLE branding_settings IS 'Stores all customizable branding, contact information, and content for the application';

-- Add comments to important columns
COMMENT ON COLUMN branding_settings.testimonials IS 'JSON array of testimonials with id, name, role, text, and visible fields';
COMMENT ON COLUMN branding_settings.latitude IS 'Latitude for Google Maps integration';
COMMENT ON COLUMN branding_settings.longitude IS 'Longitude for Google Maps integration';
