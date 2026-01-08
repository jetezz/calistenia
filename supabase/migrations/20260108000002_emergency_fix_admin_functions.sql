-- Emergency fix: Force replace admin RPC functions
-- This migration forcefully replaces the functions with the correct implementation

-- Drop functions with CASCADE to ensure clean removal
DROP FUNCTION IF EXISTS get_admin_dashboard_data() CASCADE;
DROP FUNCTION IF EXISTS get_admin_secondary_data() CASCADE;

-- Function 1: Get critical dashboard data (CORRECTED VERSION)
CREATE FUNCTION get_admin_dashboard_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  profiles_data jsonb;
  bookings_data jsonb;
  pending_requests_data jsonb;
  active_slots_data jsonb;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Fetch profiles (separate query to avoid GROUP BY issues)
  SELECT COALESCE(jsonb_agg(row_to_json(p.*) ORDER BY p.created_at DESC), '[]'::jsonb)
  INTO profiles_data
  FROM profiles p;

  -- Fetch bookings with relations (separate query)
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', b.id,
      'user_id', b.user_id,
      'time_slot_id', b.time_slot_id,
      'booking_date', b.booking_date,
      'status', b.status,
      'created_at', b.created_at,
      'updated_at', b.updated_at,
      'created_by', b.created_by,
      'time_slot', jsonb_build_object(
        'id', ts.id,
        'slot_type', ts.slot_type,
        'day_of_week', ts.day_of_week,
        'specific_date', ts.specific_date,
        'start_time', ts.start_time,
        'end_time', ts.end_time,
        'capacity', ts.capacity,
        'is_active', ts.is_active,
        'created_at', ts.created_at,
        'updated_at', ts.updated_at,
        'created_by', ts.created_by
      ),
      'user', jsonb_build_object(
        'id', u.id,
        'full_name', u.full_name,
        'email', u.email
      )
    ) ORDER BY b.booking_date DESC, b.created_at DESC
  ), '[]'::jsonb)
  INTO bookings_data
  FROM bookings b
  LEFT JOIN time_slots ts ON ts.id = b.time_slot_id
  LEFT JOIN profiles u ON u.id = b.user_id;

  -- Fetch pending payment requests
  SELECT COALESCE(jsonb_agg(row_to_json(pr.*) ORDER BY pr.created_at ASC), '[]'::jsonb)
  INTO pending_requests_data
  FROM payment_requests pr
  WHERE pr.status = 'pending';

  -- Fetch active time slots
  SELECT COALESCE(jsonb_agg(row_to_json(ts.*) ORDER BY ts.slot_type ASC, ts.day_of_week ASC, ts.specific_date ASC, ts.start_time ASC), '[]'::jsonb)
  INTO active_slots_data
  FROM time_slots ts
  WHERE ts.is_active = true;

  -- Build final result
  result := jsonb_build_object(
    'profiles', profiles_data,
    'bookings', bookings_data,
    'pending_payment_requests', pending_requests_data,
    'active_time_slots', active_slots_data
  );

  RETURN result;
END;
$$;

-- Function 2: Get secondary admin data (CORRECTED VERSION)
CREATE FUNCTION get_admin_secondary_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  all_slots_data jsonb;
  all_requests_data jsonb;
  pricing_data jsonb;
  payment_methods_data jsonb;
  settings_data jsonb;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Fetch all time slots
  SELECT COALESCE(jsonb_agg(row_to_json(ts.*) ORDER BY ts.slot_type ASC, ts.day_of_week ASC, ts.specific_date ASC, ts.start_time ASC), '[]'::jsonb)
  INTO all_slots_data
  FROM time_slots ts;

  -- Fetch all payment requests
  SELECT COALESCE(jsonb_agg(row_to_json(pr.*) ORDER BY pr.created_at DESC), '[]'::jsonb)
  INTO all_requests_data
  FROM payment_requests pr;

  -- Fetch pricing packages
  SELECT COALESCE(jsonb_agg(row_to_json(pp.*) ORDER BY pp.display_order ASC), '[]'::jsonb)
  INTO pricing_data
  FROM pricing_packages pp;

  -- Fetch payment methods
  SELECT COALESCE(jsonb_agg(row_to_json(pm.*) ORDER BY pm.display_order ASC), '[]'::jsonb)
  INTO payment_methods_data
  FROM payment_methods pm;

  -- Fetch app settings
  SELECT COALESCE(jsonb_agg(row_to_json(s.*)), '[]'::jsonb)
  INTO settings_data
  FROM app_settings s;

  -- Build final result
  result := jsonb_build_object(
    'all_time_slots', all_slots_data,
    'all_payment_requests', all_requests_data,
    'pricing_packages', pricing_data,
    'payment_methods', payment_methods_data,
    'app_settings', settings_data
  );

  RETURN result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_admin_dashboard_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_secondary_data() TO authenticated;

-- Add comments
COMMENT ON FUNCTION get_admin_dashboard_data() IS 'Fetches critical admin dashboard data in a single call. Returns profiles, bookings, pending payment requests, and active time slots.';
COMMENT ON FUNCTION get_admin_secondary_data() IS 'Fetches secondary admin data in background. Returns all time slots, payment requests, pricing packages, payment methods, and app settings.';
