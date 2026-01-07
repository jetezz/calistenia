-- =============================================
-- FIX DUPLICATE PROFILE CREATION
-- =============================================

-- Drop and recreate the function without manual profile creation
DROP FUNCTION IF EXISTS public.admin_create_user(TEXT, TEXT, TEXT);

-- Function to create a new user (admin only)
CREATE OR REPLACE FUNCTION public.admin_create_user(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_admin_id UUID;
  v_encrypted_password TEXT;
BEGIN
  -- Get the current user ID
  v_admin_id := auth.uid();
  
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = v_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can create users';
  END IF;

  -- Generate a new user ID
  v_user_id := gen_random_uuid();
  
  -- Hash the password using pgcrypto extension
  v_encrypted_password := extensions.crypt(p_password, extensions.gen_salt('bf'));

  -- Create the user in auth.users (the trigger will create the profile automatically)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    p_email,
    v_encrypted_password,
    NOW(), -- Auto-confirm email
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', p_full_name),
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    FALSE,
    NULL
  );

  -- Wait a moment for the trigger to create the profile, then update the full_name
  UPDATE public.profiles 
  SET full_name = p_full_name 
  WHERE id = v_user_id;

  RETURN v_user_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.admin_create_user(TEXT, TEXT, TEXT) TO authenticated;

COMMENT ON FUNCTION public.admin_create_user IS 'Allows admins to create new users without logging in as them (uses trigger for profile creation)';
