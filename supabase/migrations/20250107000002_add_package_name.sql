-- =============================================
-- ADD PACKAGE NAME TO PRICING PACKAGES
-- =============================================

ALTER TABLE public.pricing_packages
ADD COLUMN package_name TEXT;

COMMENT ON COLUMN public.pricing_packages.package_name IS 'Optional label for the package (e.g., "Pack Básico", "Pack Premium")';

-- Update existing records with default package names
UPDATE public.pricing_packages
SET package_name = CASE
    WHEN credits = 4 THEN 'Pack Básico'
    WHEN credits = 8 THEN 'Pack Estándar'
    WHEN credits = 12 THEN 'Pack Avanzado'
    WHEN credits = 20 THEN 'Pack Premium'
    ELSE NULL
END
WHERE package_name IS NULL;
