-- =============================================
-- ENHANCED TIME SLOTS MIGRATION
-- Adds support for both weekly recurring and specific date slots
-- =============================================

-- Add new columns to support both recurring and specific date slots
ALTER TABLE public.time_slots 
ADD COLUMN slot_type TEXT NOT NULL DEFAULT 'recurring' CHECK (slot_type IN ('recurring', 'specific_date')),
ADD COLUMN specific_date DATE,
ADD COLUMN created_by UUID REFERENCES public.profiles(id);

-- Update comments
COMMENT ON COLUMN public.time_slots.slot_type IS 'Type: recurring (weekly) or specific_date (one-time)';
COMMENT ON COLUMN public.time_slots.specific_date IS 'Used only when slot_type is specific_date';
COMMENT ON COLUMN public.time_slots.created_by IS 'Admin who created this slot';

-- Modify the unique constraint to handle both types
ALTER TABLE public.time_slots 
DROP CONSTRAINT time_slots_day_of_week_start_time_key;

-- Add new unique constraints
-- For recurring slots: unique by day_of_week + start_time
-- For specific date slots: unique by specific_date + start_time
CREATE UNIQUE INDEX unique_recurring_slots 
ON public.time_slots (day_of_week, start_time) 
WHERE slot_type = 'recurring';

CREATE UNIQUE INDEX unique_specific_date_slots 
ON public.time_slots (specific_date, start_time) 
WHERE slot_type = 'specific_date';

-- Add constraint to ensure specific_date is provided when slot_type is 'specific_date'
ALTER TABLE public.time_slots 
ADD CONSTRAINT check_specific_date_required 
CHECK (
  (slot_type = 'recurring' AND specific_date IS NULL) 
  OR 
  (slot_type = 'specific_date' AND specific_date IS NOT NULL)
);

-- Add constraint to ensure day_of_week is meaningful for recurring slots
ALTER TABLE public.time_slots 
ADD CONSTRAINT check_day_of_week_for_recurring 
CHECK (
  (slot_type = 'specific_date') 
  OR 
  (slot_type = 'recurring' AND day_of_week BETWEEN 0 AND 6)
);

-- Create index for performance on specific_date queries
CREATE INDEX idx_time_slots_specific_date ON public.time_slots (specific_date) 
WHERE slot_type = 'specific_date';

-- Create index for performance on slot_type queries
CREATE INDEX idx_time_slots_type ON public.time_slots (slot_type);