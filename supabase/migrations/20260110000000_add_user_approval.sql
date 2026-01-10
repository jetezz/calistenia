-- =============================================
-- USER APPROVAL SYSTEM
-- Agrega sistema de aprobación de usuarios por admin
-- =============================================

-- Agregar columna approval_status a la tabla profiles
ALTER TABLE public.profiles
ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending'
CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Crear índice para mejorar rendimiento de consultas
CREATE INDEX idx_profiles_approval_status ON public.profiles(approval_status);

-- =============================================
-- ACTUALIZAR FUNCIÓN DE CREACIÓN DE USUARIO
-- Los nuevos usuarios empiezan con status 'pending'
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, approval_status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        'pending'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ACTUALIZAR RLS POLICIES
-- Solo usuarios aprobados pueden acceder a los recursos
-- =============================================

-- Eliminar políticas antiguas de time_slots para usuarios
DROP POLICY IF EXISTS "Anyone authenticated can view active time slots" ON public.time_slots;

-- Nueva política: solo usuarios aprobados pueden ver time slots
CREATE POLICY "Approved users can view active time slots"
    ON public.time_slots FOR SELECT
    USING (
        is_active = true
        AND auth.uid() IS NOT NULL
        AND (
            EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND approval_status = 'approved'
            )
            OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'admin'
            )
        )
    );

-- Actualizar política de bookings: solo usuarios aprobados pueden crear reservas
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;

CREATE POLICY "Approved users can create own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (
        (auth.uid() = user_id AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND approval_status = 'approved'
        ))
        OR auth.uid() = created_by
    );

-- Actualizar política de payment_requests: solo usuarios aprobados pueden crear solicitudes
DROP POLICY IF EXISTS "Users can create payment requests" ON public.payment_requests;

CREATE POLICY "Approved users can create payment requests"
    ON public.payment_requests FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND approval_status = 'approved'
        )
    );

-- =============================================
-- POLÍTICA PARA QUE ADMINS PUEDAN ACTUALIZAR approval_status
-- =============================================
-- Esta política ya existe en "Admins can update all profiles"
-- pero vamos a asegurarnos de que funcione correctamente

-- =============================================
-- FUNCIÓN HELPER PARA APROBAR USUARIOS
-- =============================================
CREATE OR REPLACE FUNCTION approve_user(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Verificar que el usuario que llama sea admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can approve users';
    END IF;

    -- Actualizar el estado del usuario
    UPDATE public.profiles
    SET approval_status = 'approved'
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCIÓN HELPER PARA RECHAZAR USUARIOS
-- =============================================
CREATE OR REPLACE FUNCTION reject_user(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Verificar que el usuario que llama sea admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can reject users';
    END IF;

    -- Actualizar el estado del usuario
    UPDATE public.profiles
    SET approval_status = 'rejected'
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- MIGRAR USUARIOS EXISTENTES A 'APPROVED'
-- Los usuarios que ya existen deben ser aprobados automáticamente
-- =============================================
UPDATE public.profiles
SET approval_status = 'approved'
WHERE approval_status = 'pending';

COMMENT ON COLUMN public.profiles.approval_status IS 'User approval status: pending (waiting), approved (can use app), rejected (denied access)';
