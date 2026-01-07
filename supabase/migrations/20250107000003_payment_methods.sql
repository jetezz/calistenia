-- =============================================
-- PAYMENT METHODS TABLE
-- =============================================

CREATE TABLE public.payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('bizum', 'paypal', 'bank_transfer', 'cash', 'other')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    contact_email TEXT,
    contact_phone TEXT,
    bank_account TEXT,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.payment_methods IS 'Configurable payment methods for client transactions';
COMMENT ON COLUMN public.payment_methods.name IS 'Display name of the payment method';
COMMENT ON COLUMN public.payment_methods.type IS 'Type of payment: bizum, paypal, bank_transfer, cash, other';
COMMENT ON COLUMN public.payment_methods.is_active IS 'Whether the method is visible to clients';
COMMENT ON COLUMN public.payment_methods.display_order IS 'Sort order for display (lower = first)';
COMMENT ON COLUMN public.payment_methods.contact_email IS 'Email for payments (e.g., PayPal)';
COMMENT ON COLUMN public.payment_methods.contact_phone IS 'Phone number for payments (e.g., Bizum)';
COMMENT ON COLUMN public.payment_methods.bank_account IS 'Bank account/IBAN for transfers';
COMMENT ON COLUMN public.payment_methods.instructions IS 'Additional instructions for clients';

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_payment_methods_active ON public.payment_methods(is_active);
CREATE INDEX idx_payment_methods_display_order ON public.payment_methods(display_order);
CREATE INDEX idx_payment_methods_type ON public.payment_methods(type);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_methods_select_active"
    ON public.payment_methods
    FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "payment_methods_select_all_admin"
    ON public.payment_methods
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "payment_methods_insert_admin"
    ON public.payment_methods
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "payment_methods_update_admin"
    ON public.payment_methods
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "payment_methods_delete_admin"
    ON public.payment_methods
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

INSERT INTO public.payment_methods (name, type, contact_phone, instructions, display_order) VALUES
('Bizum', 'bizum', '629845671', 'Envía el importe a través de Bizum e incluye tu nombre completo en el concepto. Los créditos se activarán en 24-48h.', 1);

INSERT INTO public.payment_methods (name, type, contact_email, instructions, display_order) VALUES
('PayPal', 'paypal', 'calistenia.center@gmail.com', 'Envía el pago a través de PayPal usando la opción "Enviar dinero a amigos". Incluye tu nombre y número de clases en el concepto.', 2);

INSERT INTO public.payment_methods (name, type, bank_account, instructions, display_order) VALUES
('Transferencia Bancaria', 'bank_transfer', 'ES12 1234 1234 12 1234567890', 'Realiza una transferencia bancaria incluyendo tu nombre completo en el concepto. Los créditos se activarán tras confirmar el pago.', 3);

INSERT INTO public.payment_methods (name, type, instructions, display_order) VALUES
('Efectivo', 'cash', 'Puedes realizar el pago en efectivo directamente en el centro durante las clases. Consulta disponibilidad con el entrenador.', 4);
