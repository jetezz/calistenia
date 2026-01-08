-- Migration: Create RPC functions for admin data fetching
-- Purpose: Reduce duplicate API calls by fetching all admin data in 1-2 calls

-- Function 1: Get critical dashboard data (shown immediately)
CREATE OR REPLACE FUNCTION get_admin_dashboard_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Fetch all critical data in one query
  SELECT jsonb_build_object(
    'profiles', (
      SELECT jsonb_agg(p.*)
      FROM profiles p
      ORDER BY p.created_at DESC
    ),
    'bookings', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', b.id,
          'user_id', b.user_id,
          'time_slot_id', b.time_slot_id,
          'booking_date', b.booking_date,
          'status', b.status,
          'created_at', b.created_at,
          'updated_at', b.updated_at,
          'time_slot', (
            SELECT jsonb_build_object(
              'id', ts.id,
              'slot_type', ts.slot_type,
              'day_of_week', ts.day_of_week,
              'specific_date', ts.specific_date,
              'start_time', ts.start_time,
              'end_time', ts.end_time,
              'max_capacity', ts.max_capacity,
              'is_active', ts.is_active
            )
            FROM time_slots ts
            WHERE ts.id = b.time_slot_id
          ),
          'user', (
            SELECT jsonb_build_object(
              'id', u.id,
              'full_name', u.full_name,
              'email', u.email
            )
            FROM profiles u
            WHERE u.id = b.user_id
          )
        )
      )
      FROM bookings b
      ORDER BY b.booking_date DESC, b.created_at DESC
    ),
    'pending_payment_requests', (
      SELECT jsonb_agg(pr.*)
      FROM payment_requests pr
      WHERE pr.status = 'pending'
      ORDER BY pr.created_at ASC
    ),
    'active_time_slots', (
      SELECT jsonb_agg(ts.*)
      FROM time_slots ts
      WHERE ts.is_active = true
      ORDER BY ts.slot_type ASC, ts.day_of_week ASC, ts.specific_date ASC, ts.start_time ASC
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Function 2: Get secondary admin data (loaded in background)
CREATE OR REPLACE FUNCTION get_admin_secondary_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Fetch all secondary data
  SELECT jsonb_build_object(
    'all_time_slots', (
      SELECT jsonb_agg(ts.*)
      FROM time_slots ts
      ORDER BY ts.slot_type ASC, ts.day_of_week ASC, ts.specific_date ASC, ts.start_time ASC
    ),
    'all_payment_requests', (
      SELECT jsonb_agg(pr.*)
      FROM payment_requests pr
      ORDER BY pr.created_at DESC
    ),
    'pricing_packages', (
      SELECT jsonb_agg(pp.*)
      FROM pricing_packages pp
      ORDER BY pp.display_order ASC
    ),
    'payment_methods', (
      SELECT jsonb_agg(pm.*)
      FROM payment_methods pm
      ORDER BY pm.display_order ASC
    ),
    'app_settings', (
      SELECT jsonb_agg(s.*)
      FROM app_settings s
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_admin_dashboard_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_secondary_data() TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION get_admin_dashboard_data() IS 'Fetches critical admin dashboard data in a single call. Returns profiles, bookings, pending payment requests, and active time slots.';
COMMENT ON FUNCTION get_admin_secondary_data() IS 'Fetches secondary admin data in background. Returns all time slots, payment requests, pricing packages, payment methods, and app settings.';
