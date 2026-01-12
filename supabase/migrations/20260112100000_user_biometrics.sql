-- =============================================
-- USER BIOMETRICS MIGRATION
-- Adds columns to profiles for calculating ideal stats
-- =============================================

-- Add biometric columns to profiles table
DO $$
BEGIN
    -- Add gender if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'gender') THEN
        ALTER TABLE public.profiles ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female'));
    END IF;

    -- Add height if not exists (in cm)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'height') THEN
        ALTER TABLE public.profiles ADD COLUMN height NUMERIC CHECK (height > 0 AND height < 300); -- Reasonable height limits
    END IF;

    -- Add birth_date if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'birth_date') THEN
        ALTER TABLE public.profiles ADD COLUMN birth_date DATE;
    END IF;

    -- Add physical_objective if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'physical_objective') THEN
        ALTER TABLE public.profiles ADD COLUMN physical_objective TEXT CHECK (physical_objective IN ('health', 'strength', 'longevity', 'aesthetics'));
    END IF;
END $$;

-- Comments for documentation
COMMENT ON COLUMN public.profiles.gender IS 'Biological sex for medical calculations (male/female)';
COMMENT ON COLUMN public.profiles.height IS 'User height in centimeters';
COMMENT ON COLUMN public.profiles.birth_date IS 'Date of birth for age calculation';
COMMENT ON COLUMN public.profiles.physical_objective IS 'User primary physical goal: health, strength, longevity, aesthetics';

-- Update RLS policies?
-- Existing "Users can update own basic info" policy checks specific columns (role, credits).
-- We need to ensure users can update these NEW columns.
-- The existing policy:
-- CHECK (auth.uid() = id AND role = (SELECT role ...) AND credits = (SELECT credits ...))
-- This policy basically says "As long as you don't change your ID, role, or credits, you can update anything else".
-- So no new policy needed if the existing one is:
-- USING (auth.uid() = id)
-- WITH CHECK (... restrictive checks on role/credits ...)
-- Let's verify standard simple update policy usually allows all columns unless restricted.
-- The policy I saw in app_schema.sql was:
-- CREATE POLICY "Users can update own basic info" ... WITH CHECK ( ... role = ... credits = ... )
-- This implies that if the update *doesn't change* role/credits (i.e. new row has same role/credits), it's allowed.
-- So adding new columns is fine as long as the user doesn't try to change role/credits in the same payload (which they shouldn't).
-- However, if there's no explicit permission for new columns, it might be an issue if the RLS was restrictive on *columns*.
-- PostgreSQL RLS is row-based.
-- So we are good.

-- Create a helper function to calculate age (optional but useful)
CREATE OR REPLACE FUNCTION public.calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN DATE_PART('year', AGE(CURRENT_DATE, birth_date));
END;
$$ LANGUAGE plpgsql IMMUTABLE;
