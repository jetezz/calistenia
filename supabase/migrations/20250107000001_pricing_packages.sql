-- =============================================
-- PRICING PACKAGES TABLE
-- =============================================

CREATE TABLE public.pricing_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.pricing_packages IS 'Configurable pricing packages for credit purchases';
COMMENT ON COLUMN public.pricing_packages.name IS 'Display name for the package (e.g., "4 clases")';
COMMENT ON COLUMN public.pricing_packages.credits IS 'Number of credits/classes in the package';
COMMENT ON COLUMN public.pricing_packages.price IS 'Price in euros';
COMMENT ON COLUMN public.pricing_packages.is_active IS 'Whether the package is visible to clients';
COMMENT ON COLUMN public.pricing_packages.display_order IS 'Sort order for display (lower = first)';

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_pricing_packages_active ON public.pricing_packages(is_active);
CREATE INDEX idx_pricing_packages_display_order ON public.pricing_packages(display_order);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pricing_packages_select_active"
    ON public.pricing_packages
    FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "pricing_packages_select_all_admin"
    ON public.pricing_packages
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "pricing_packages_insert_admin"
    ON public.pricing_packages
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "pricing_packages_update_admin"
    ON public.pricing_packages
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "pricing_packages_delete_admin"
    ON public.pricing_packages
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- =============================================
-- SEED DATA
-- =============================================

INSERT INTO public.pricing_packages (name, credits, price, display_order) VALUES
('4 clases', 4, 40.00, 1),
('8 clases', 8, 70.00, 2),
('12 clases', 12, 100.00, 3),
('20 clases', 20, 160.00, 4);
