-- =====================================================
-- WEIGHT STATS TRACKING SYSTEM
-- =====================================================
-- Description: Sistema de seguimiento de estadísticas de composición corporal
-- Date: 2026-01-12
-- Author: Claude Code
-- =====================================================

-- =====================================================
-- 1. CREATE TABLE: weight_stats
-- =====================================================
-- Tabla para almacenar las mediciones de composición corporal de los usuarios

CREATE TABLE IF NOT EXISTS public.weight_stats (
  -- Identificadores
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Métricas de composición corporal
  weight DECIMAL(5, 2) NOT NULL CHECK (weight > 0 AND weight < 500), -- Peso en kg (0.01 a 499.99)
  body_fat_percentage DECIMAL(4, 2) CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100), -- % grasa (0 a 100)
  muscle_mass DECIMAL(5, 2) CHECK (muscle_mass >= 0 AND muscle_mass < 300), -- Masa muscular en kg
  bone_mass DECIMAL(4, 2) CHECK (bone_mass >= 0 AND bone_mass < 50), -- Masa ósea en kg
  bmi DECIMAL(4, 2) CHECK (bmi > 0 AND bmi < 100), -- Índice de masa corporal
  daily_calorie_intake INTEGER CHECK (daily_calorie_intake > 0 AND daily_calorie_intake < 10000), -- Calorías diarias
  metabolic_age INTEGER CHECK (metabolic_age > 0 AND metabolic_age < 150), -- Edad metabólica en años
  total_body_water_percentage DECIMAL(4, 2) CHECK (total_body_water_percentage >= 0 AND total_body_water_percentage <= 100), -- % agua (0 a 100)

  -- Metadata
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Fecha de la medición
  notes TEXT, -- Notas opcionales del usuario

  -- Timestamps de auditoría
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================
-- Optimización de consultas frecuentes

-- Índice para consultas por usuario (más común)
CREATE INDEX IF NOT EXISTS idx_weight_stats_user_id
  ON public.weight_stats(user_id);

-- Índice para ordenar por fecha de medición
CREATE INDEX IF NOT EXISTS idx_weight_stats_recorded_at
  ON public.weight_stats(recorded_at DESC);

-- Índice compuesto para consultas por usuario y fecha (más eficiente)
CREATE INDEX IF NOT EXISTS idx_weight_stats_user_recorded
  ON public.weight_stats(user_id, recorded_at DESC);

-- Índice para búsquedas por fecha de creación
CREATE INDEX IF NOT EXISTS idx_weight_stats_created_at
  ON public.weight_stats(created_at DESC);

-- =====================================================
-- 3. TRIGGER: updated_at auto-update
-- =====================================================
-- Actualiza automáticamente el campo updated_at cuando se modifica un registro

CREATE OR REPLACE FUNCTION public.update_weight_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_weight_stats_updated_at_trigger
  BEFORE UPDATE ON public.weight_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_weight_stats_updated_at();

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Seguridad: Los usuarios solo pueden ver y gestionar sus propias mediciones

-- Habilitar RLS en la tabla
ALTER TABLE public.weight_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Los usuarios pueden ver solo sus propias mediciones
CREATE POLICY "Users can view their own weight stats"
  ON public.weight_stats
  FOR SELECT
  USING (
    auth.uid() = user_id
  );

-- Policy: Los usuarios pueden crear sus propias mediciones
CREATE POLICY "Users can create their own weight stats"
  ON public.weight_stats
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

-- Policy: Los usuarios pueden actualizar solo sus propias mediciones
CREATE POLICY "Users can update their own weight stats"
  ON public.weight_stats
  FOR UPDATE
  USING (
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = user_id
  );

-- Policy: Los usuarios pueden eliminar solo sus propias mediciones
CREATE POLICY "Users can delete their own weight stats"
  ON public.weight_stats
  FOR DELETE
  USING (
    auth.uid() = user_id
  );

-- Policy: Los admins pueden ver todas las mediciones (opcional)
CREATE POLICY "Admins can view all weight stats"
  ON public.weight_stats
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Función: Obtener la última medición de un usuario
CREATE OR REPLACE FUNCTION public.get_latest_weight_stat(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  weight DECIMAL(5, 2),
  body_fat_percentage DECIMAL(4, 2),
  muscle_mass DECIMAL(5, 2),
  bone_mass DECIMAL(4, 2),
  bmi DECIMAL(4, 2),
  daily_calorie_intake INTEGER,
  metabolic_age INTEGER,
  total_body_water_percentage DECIMAL(4, 2),
  recorded_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ws.id,
    ws.user_id,
    ws.weight,
    ws.body_fat_percentage,
    ws.muscle_mass,
    ws.bone_mass,
    ws.bmi,
    ws.daily_calorie_intake,
    ws.metabolic_age,
    ws.total_body_water_percentage,
    ws.recorded_at,
    ws.notes,
    ws.created_at,
    ws.updated_at
  FROM public.weight_stats ws
  WHERE ws.user_id = p_user_id
  ORDER BY ws.recorded_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Obtener estadísticas de un usuario en un rango de fechas
CREATE OR REPLACE FUNCTION public.get_weight_stats_by_date_range(
  p_user_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  weight DECIMAL(5, 2),
  body_fat_percentage DECIMAL(4, 2),
  muscle_mass DECIMAL(5, 2),
  bone_mass DECIMAL(4, 2),
  bmi DECIMAL(4, 2),
  daily_calorie_intake INTEGER,
  metabolic_age INTEGER,
  total_body_water_percentage DECIMAL(4, 2),
  recorded_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ws.id,
    ws.user_id,
    ws.weight,
    ws.body_fat_percentage,
    ws.muscle_mass,
    ws.bone_mass,
    ws.bmi,
    ws.daily_calorie_intake,
    ws.metabolic_age,
    ws.total_body_water_percentage,
    ws.recorded_at,
    ws.notes,
    ws.created_at,
    ws.updated_at
  FROM public.weight_stats ws
  WHERE ws.user_id = p_user_id
    AND ws.recorded_at >= p_start_date
    AND ws.recorded_at <= p_end_date
  ORDER BY ws.recorded_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Calcular cambio de peso entre dos fechas
CREATE OR REPLACE FUNCTION public.calculate_weight_change(
  p_user_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  weight_change DECIMAL(5, 2),
  percentage_change DECIMAL(5, 2),
  start_weight DECIMAL(5, 2),
  end_weight DECIMAL(5, 2)
) AS $$
DECLARE
  v_start_weight DECIMAL(5, 2);
  v_end_weight DECIMAL(5, 2);
BEGIN
  -- Obtener peso inicial
  SELECT ws.weight INTO v_start_weight
  FROM public.weight_stats ws
  WHERE ws.user_id = p_user_id
    AND ws.recorded_at >= p_start_date
  ORDER BY ws.recorded_at ASC
  LIMIT 1;

  -- Obtener peso final
  SELECT ws.weight INTO v_end_weight
  FROM public.weight_stats ws
  WHERE ws.user_id = p_user_id
    AND ws.recorded_at <= p_end_date
  ORDER BY ws.recorded_at DESC
  LIMIT 1;

  -- Calcular cambios
  IF v_start_weight IS NOT NULL AND v_end_weight IS NOT NULL THEN
    RETURN QUERY
    SELECT
      (v_end_weight - v_start_weight) AS weight_change,
      (((v_end_weight - v_start_weight) / v_start_weight) * 100) AS percentage_change,
      v_start_weight AS start_weight,
      v_end_weight AS end_weight;
  ELSE
    RETURN QUERY
    SELECT
      NULL::DECIMAL(5, 2) AS weight_change,
      NULL::DECIMAL(5, 2) AS percentage_change,
      v_start_weight AS start_weight,
      v_end_weight AS end_weight;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. GRANT PERMISSIONS
-- =====================================================
-- Permisos para usuarios autenticados

GRANT SELECT, INSERT, UPDATE, DELETE ON public.weight_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_latest_weight_stat(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_weight_stats_by_date_range(UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_weight_change(UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;

-- =====================================================
-- 7. COMMENTS (Documentación)
-- =====================================================

COMMENT ON TABLE public.weight_stats IS 'Almacena las mediciones de composición corporal de los usuarios';
COMMENT ON COLUMN public.weight_stats.weight IS 'Peso corporal total en kilogramos';
COMMENT ON COLUMN public.weight_stats.body_fat_percentage IS 'Porcentaje de grasa corporal (0-100)';
COMMENT ON COLUMN public.weight_stats.muscle_mass IS 'Masa muscular en kilogramos';
COMMENT ON COLUMN public.weight_stats.bone_mass IS 'Masa ósea en kilogramos';
COMMENT ON COLUMN public.weight_stats.bmi IS 'Índice de Masa Corporal (kg/m²)';
COMMENT ON COLUMN public.weight_stats.daily_calorie_intake IS 'Ingesta diaria de calorías recomendada';
COMMENT ON COLUMN public.weight_stats.metabolic_age IS 'Edad metabólica en años';
COMMENT ON COLUMN public.weight_stats.total_body_water_percentage IS 'Porcentaje de agua corporal total (0-100)';
COMMENT ON COLUMN public.weight_stats.recorded_at IS 'Fecha y hora en que se realizó la medición';
COMMENT ON COLUMN public.weight_stats.notes IS 'Notas adicionales del usuario sobre la medición';

-- =====================================================
-- MIGRATION COMPLETED
-- =====================================================
