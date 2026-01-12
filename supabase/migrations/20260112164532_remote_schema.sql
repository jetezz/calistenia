

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."admin_create_user"("p_email" "text", "p_password" "text", "p_full_name" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth', 'extensions'
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


ALTER FUNCTION "public"."admin_create_user"("p_email" "text", "p_password" "text", "p_full_name" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."admin_create_user"("p_email" "text", "p_password" "text", "p_full_name" "text") IS 'Allows admins to create new users without logging in as them (uses trigger for profile creation)';



CREATE OR REPLACE FUNCTION "public"."admin_delete_user"("p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- Get the current user ID
  v_admin_id := auth.uid();
  
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = v_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;

  -- Prevent admin from deleting themselves
  IF v_admin_id = p_user_id THEN
    RAISE EXCEPTION 'Admins cannot delete themselves';
  END IF;

  -- Prevent deleting other admins
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = p_user_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Cannot delete other admin users';
  END IF;

  -- Delete from auth.users (cascade will handle profiles and related data)
  DELETE FROM auth.users WHERE id = p_user_id;

  RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."admin_delete_user"("p_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."admin_delete_user"("p_user_id" "uuid") IS 'Allows admins to delete users (except themselves and other admins)';



CREATE OR REPLACE FUNCTION "public"."approve_user"("target_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."approve_user"("target_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_age"("birth_date" "date") RETURNS integer
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
BEGIN
    RETURN DATE_PART('year', AGE(CURRENT_DATE, birth_date));
END;
$$;


ALTER FUNCTION "public"."calculate_age"("birth_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_weight_change"("p_user_id" "uuid", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) RETURNS TABLE("weight_change" numeric, "percentage_change" numeric, "start_weight" numeric, "end_weight" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."calculate_weight_change"("p_user_id" "uuid", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_admin_dashboard_data"() RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."get_admin_dashboard_data"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_admin_dashboard_data"() IS 'Fetches critical admin dashboard data in a single call. Returns profiles, bookings, pending payment requests, and active time slots.';



CREATE OR REPLACE FUNCTION "public"."get_admin_secondary_data"() RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."get_admin_secondary_data"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_admin_secondary_data"() IS 'Fetches secondary admin data in background. Returns all time slots, payment requests, pricing packages, payment methods, and app settings.';



CREATE OR REPLACE FUNCTION "public"."get_available_spots"("slot_id" "uuid", "target_date" "date") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    slot_capacity INTEGER;
    current_bookings INTEGER;
BEGIN
    SELECT capacity INTO slot_capacity
    FROM public.time_slots
    WHERE id = slot_id;
    
    SELECT COUNT(*) INTO current_bookings
    FROM public.bookings
    WHERE time_slot_id = slot_id 
      AND booking_date = target_date 
      AND status = 'confirmed';
    
    RETURN slot_capacity - current_bookings;
END;
$$;


ALTER FUNCTION "public"."get_available_spots"("slot_id" "uuid", "target_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_latest_weight_stat"("p_user_id" "uuid") RETURNS TABLE("id" "uuid", "user_id" "uuid", "weight" numeric, "body_fat_percentage" numeric, "muscle_mass" numeric, "bone_mass" numeric, "bmi" numeric, "daily_calorie_intake" integer, "metabolic_age" integer, "total_body_water_percentage" numeric, "recorded_at" timestamp with time zone, "notes" "text", "created_at" timestamp with time zone, "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."get_latest_weight_stat"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_weight_stats_by_date_range"("p_user_id" "uuid", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) RETURNS TABLE("id" "uuid", "user_id" "uuid", "weight" numeric, "body_fat_percentage" numeric, "muscle_mass" numeric, "bone_mass" numeric, "bmi" numeric, "daily_calorie_intake" integer, "metabolic_age" integer, "total_body_water_percentage" numeric, "recorded_at" timestamp with time zone, "notes" "text", "created_at" timestamp with time zone, "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."get_weight_stats_by_date_range"("p_user_id" "uuid", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_booking_cancellation_refund"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status = 'confirmed' THEN
        UPDATE public.profiles
        SET credits = credits + 1
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_booking_cancellation_refund"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."handle_booking_cancellation_refund"() IS 'Automatically refunds 1 credit when a confirmed booking is cancelled';



CREATE OR REPLACE FUNCTION "public"."handle_booking_credit_deduction"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    IF NEW.status = 'confirmed' AND (TG_OP = 'INSERT' OR OLD.status != 'confirmed') THEN
        UPDATE public.profiles
        SET credits = credits - 1
        WHERE id = NEW.user_id AND credits > 0;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'User does not have enough credits';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_booking_credit_deduction"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."handle_booking_credit_deduction"() IS 'Automatically deducts 1 credit when a confirmed booking is created';



CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"("user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
END;
$$;


ALTER FUNCTION "public"."is_admin"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reject_user"("target_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."reject_user"("target_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_app_settings_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_app_settings_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_branding_settings_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_branding_settings_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_weight_stats_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_weight_stats_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."app_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" "text" NOT NULL,
    "value" "jsonb" NOT NULL,
    "description" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."app_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "time_slot_id" "uuid" NOT NULL,
    "booking_date" "date" NOT NULL,
    "status" "text" DEFAULT 'confirmed'::"text" NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "bookings_status_check" CHECK (("status" = ANY (ARRAY['confirmed'::"text", 'cancelled'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


COMMENT ON TABLE "public"."bookings" IS 'User reservations for training slots';



COMMENT ON COLUMN "public"."bookings"."created_by" IS 'NULL if self-booked, admin_id if booked by admin';



CREATE TABLE IF NOT EXISTS "public"."branding_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business_name" "text" DEFAULT 'Calistenia Emérita'::"text" NOT NULL,
    "logo_url" "text",
    "show_logo" boolean DEFAULT true NOT NULL,
    "hero_image_url" "text",
    "trainer_image_url" "text",
    "group_image_url" "text",
    "show_hero_image" boolean DEFAULT true NOT NULL,
    "show_trainer_image" boolean DEFAULT true NOT NULL,
    "show_group_image" boolean DEFAULT true NOT NULL,
    "email" "text",
    "phone" "text",
    "whatsapp" "text",
    "instagram" "text",
    "show_email" boolean DEFAULT true NOT NULL,
    "show_phone" boolean DEFAULT true NOT NULL,
    "show_whatsapp" boolean DEFAULT true NOT NULL,
    "show_instagram" boolean DEFAULT true NOT NULL,
    "address" "text",
    "city" "text" DEFAULT 'Mérida'::"text" NOT NULL,
    "region" "text" DEFAULT 'Extremadura'::"text" NOT NULL,
    "country" "text" DEFAULT 'España'::"text" NOT NULL,
    "google_maps_url" "text",
    "latitude" numeric(10,8),
    "longitude" numeric(11,8),
    "show_location" boolean DEFAULT true NOT NULL,
    "schedule_weekdays" "text" DEFAULT 'Lunes - Viernes: 7:00 - 21:00'::"text",
    "schedule_saturday" "text" DEFAULT 'Sábados: 9:00 - 14:00'::"text",
    "schedule_sunday" "text" DEFAULT 'Domingos: Cerrado'::"text",
    "show_schedule" boolean DEFAULT true NOT NULL,
    "hero_title" "text" DEFAULT 'Recupera tu agilidad y fuerza sin el ambiente de un gimnasio tradicional'::"text" NOT NULL,
    "hero_subtitle" "text" DEFAULT 'Entrenamiento personal en grupos reducidos (máximo 4 personas) en Mérida. Especialistas en salud, movilidad y calistenia para mayores de 40.'::"text" NOT NULL,
    "hero_cta_text" "text" DEFAULT 'Solicitar Entrevista Gratuita'::"text" NOT NULL,
    "value_prop_title" "text" DEFAULT 'Nuestra Solución'::"text" NOT NULL,
    "value_prop_subtitle" "text" DEFAULT 'Un enfoque personalizado que prioriza tu salud y bienestar'::"text",
    "about_trainer_title" "text" DEFAULT 'Tu Entrenador Personal'::"text",
    "about_trainer_text" "text" DEFAULT 'Con años de experiencia en entrenamiento funcional y calistenia, mi enfoque está en el acompañamiento personal y la creación de una verdadera comunidad.'::"text",
    "about_trainer_quote" "text" DEFAULT 'No eres un número, eres parte de la familia.'::"text",
    "empathy_title" "text" DEFAULT '¿Te suena esto?'::"text",
    "empathy_subtitle" "text" DEFAULT 'Entendemos que no buscas un cuerpo de revista, sino atarte los cordones sin dolor'::"text",
    "final_cta_title" "text" DEFAULT 'Únete al grupo'::"text",
    "final_cta_subtitle" "text" DEFAULT 'Solo 4 plazas por hora. No esperes más para cuidar tu salud.'::"text",
    "testimonials" "jsonb" DEFAULT '[{"id": "1", "name": "María, 47 años", "role": "Funcionaria pública", "text": "Después de años con dolor de espalda, finalmente puedo jugar con mis hijos sin molestias. El ambiente es familiar y nunca me he sentido juzgada.", "visible": true}, {"id": "2", "name": "Carlos, 52 años", "role": "Administrativo", "text": "Los grupos pequeños hacen toda la diferencia. El entrenador está siempre pendiente y he recuperado movilidad que creía perdida.", "visible": true}, {"id": "3", "name": "Ana, 44 años", "role": "Profesora", "text": "Nunca me gustaron los gimnasios grandes. Aquí me siento cómoda y segura. Es como entrenar con amigos.", "visible": true}]'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."branding_settings" OWNER TO "postgres";


COMMENT ON TABLE "public"."branding_settings" IS 'Stores all customizable branding, contact information, and content for the application';



COMMENT ON COLUMN "public"."branding_settings"."latitude" IS 'Latitude for Google Maps integration';



COMMENT ON COLUMN "public"."branding_settings"."longitude" IS 'Longitude for Google Maps integration';



COMMENT ON COLUMN "public"."branding_settings"."testimonials" IS 'JSON array of testimonials with id, name, role, text, and visible fields';



CREATE TABLE IF NOT EXISTS "public"."health_check" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "text" DEFAULT 'ok'::"text" NOT NULL
);


ALTER TABLE "public"."health_check" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_methods" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "contact_email" "text",
    "contact_phone" "text",
    "bank_account" "text",
    "instructions" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "payment_methods_type_check" CHECK (("type" = ANY (ARRAY['bizum'::"text", 'paypal'::"text", 'bank_transfer'::"text", 'cash'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."payment_methods" OWNER TO "postgres";


COMMENT ON TABLE "public"."payment_methods" IS 'Configurable payment methods for client transactions';



COMMENT ON COLUMN "public"."payment_methods"."name" IS 'Display name of the payment method';



COMMENT ON COLUMN "public"."payment_methods"."type" IS 'Type of payment: bizum, paypal, bank_transfer, cash, other';



COMMENT ON COLUMN "public"."payment_methods"."is_active" IS 'Whether the method is visible to clients';



COMMENT ON COLUMN "public"."payment_methods"."display_order" IS 'Sort order for display (lower = first)';



COMMENT ON COLUMN "public"."payment_methods"."contact_email" IS 'Email for payments (e.g., PayPal)';



COMMENT ON COLUMN "public"."payment_methods"."contact_phone" IS 'Phone number for payments (e.g., Bizum)';



COMMENT ON COLUMN "public"."payment_methods"."bank_account" IS 'Bank account/IBAN for transfers';



COMMENT ON COLUMN "public"."payment_methods"."instructions" IS 'Additional instructions for clients';



CREATE TABLE IF NOT EXISTS "public"."payment_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "credits_requested" integer NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "admin_notes" "text",
    "processed_by" "uuid",
    "processed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "payment_method_id" "uuid",
    CONSTRAINT "payment_requests_credits_requested_check" CHECK (("credits_requested" > 0)),
    CONSTRAINT "payment_requests_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."payment_requests" OWNER TO "postgres";


COMMENT ON TABLE "public"."payment_requests" IS 'Credit purchase requests from users';



COMMENT ON COLUMN "public"."payment_requests"."payment_method_id" IS 'The payment method selected by the user for this request';



CREATE TABLE IF NOT EXISTS "public"."pricing_packages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "credits" integer NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "package_name" "text",
    CONSTRAINT "pricing_packages_credits_check" CHECK (("credits" > 0)),
    CONSTRAINT "pricing_packages_price_check" CHECK (("price" >= (0)::numeric))
);


ALTER TABLE "public"."pricing_packages" OWNER TO "postgres";


COMMENT ON TABLE "public"."pricing_packages" IS 'Configurable pricing packages for credit purchases';



COMMENT ON COLUMN "public"."pricing_packages"."name" IS 'Display name for the package (e.g., "4 clases")';



COMMENT ON COLUMN "public"."pricing_packages"."credits" IS 'Number of credits/classes in the package';



COMMENT ON COLUMN "public"."pricing_packages"."price" IS 'Price in euros';



COMMENT ON COLUMN "public"."pricing_packages"."is_active" IS 'Whether the package is visible to clients';



COMMENT ON COLUMN "public"."pricing_packages"."display_order" IS 'Sort order for display (lower = first)';



COMMENT ON COLUMN "public"."pricing_packages"."package_name" IS 'Optional label for the package (e.g., "Pack Básico", "Pack Premium")';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "phone" "text",
    "role" "text" DEFAULT 'user'::"text" NOT NULL,
    "credits" integer DEFAULT 0 NOT NULL,
    "payment_status" "text" DEFAULT 'none'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "approval_status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "gender" "text",
    "height" numeric,
    "birth_date" "date",
    "physical_objective" "text",
    CONSTRAINT "profiles_approval_status_check" CHECK (("approval_status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"]))),
    CONSTRAINT "profiles_credits_check" CHECK (("credits" >= 0)),
    CONSTRAINT "profiles_gender_check" CHECK (("gender" = ANY (ARRAY['male'::"text", 'female'::"text"]))),
    CONSTRAINT "profiles_height_check" CHECK ((("height" > (0)::numeric) AND ("height" < (300)::numeric))),
    CONSTRAINT "profiles_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['paid'::"text", 'pending'::"text", 'unpaid'::"text", 'none'::"text"]))),
    CONSTRAINT "profiles_physical_objective_check" CHECK (("physical_objective" = ANY (ARRAY['health'::"text", 'strength'::"text", 'longevity'::"text", 'aesthetics'::"text"]))),
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['admin'::"text", 'user'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'User profiles extending Supabase auth';



COMMENT ON COLUMN "public"."profiles"."role" IS 'User role: admin or user';



COMMENT ON COLUMN "public"."profiles"."credits" IS 'Available training session credits';



COMMENT ON COLUMN "public"."profiles"."payment_status" IS 'Current payment status';



COMMENT ON COLUMN "public"."profiles"."approval_status" IS 'User approval status: pending (waiting), approved (can use app), rejected (denied access)';



COMMENT ON COLUMN "public"."profiles"."gender" IS 'Biological sex for medical calculations (male/female)';



COMMENT ON COLUMN "public"."profiles"."height" IS 'User height in centimeters';



COMMENT ON COLUMN "public"."profiles"."birth_date" IS 'Date of birth for age calculation';



COMMENT ON COLUMN "public"."profiles"."physical_objective" IS 'User primary physical goal: health, strength, longevity, aesthetics';



CREATE TABLE IF NOT EXISTS "public"."time_slots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "day_of_week" integer NOT NULL,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    "capacity" integer DEFAULT 4 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "slot_type" "text" DEFAULT 'recurring'::"text" NOT NULL,
    "specific_date" "date",
    "created_by" "uuid",
    CONSTRAINT "check_day_of_week_for_recurring" CHECK ((("slot_type" = 'specific_date'::"text") OR (("slot_type" = 'recurring'::"text") AND (("day_of_week" >= 0) AND ("day_of_week" <= 6))))),
    CONSTRAINT "check_specific_date_required" CHECK (((("slot_type" = 'recurring'::"text") AND ("specific_date" IS NULL)) OR (("slot_type" = 'specific_date'::"text") AND ("specific_date" IS NOT NULL)))),
    CONSTRAINT "time_slots_capacity_check" CHECK (("capacity" > 0)),
    CONSTRAINT "time_slots_day_of_week_check" CHECK ((("day_of_week" >= 0) AND ("day_of_week" <= 6))),
    CONSTRAINT "time_slots_slot_type_check" CHECK (("slot_type" = ANY (ARRAY['recurring'::"text", 'specific_date'::"text"])))
);


ALTER TABLE "public"."time_slots" OWNER TO "postgres";


COMMENT ON TABLE "public"."time_slots" IS 'Available training time slots';



COMMENT ON COLUMN "public"."time_slots"."day_of_week" IS '0=Sunday, 1=Monday, ..., 6=Saturday';



COMMENT ON COLUMN "public"."time_slots"."capacity" IS 'Maximum number of users per slot';



COMMENT ON COLUMN "public"."time_slots"."slot_type" IS 'Type: recurring (weekly) or specific_date (one-time)';



COMMENT ON COLUMN "public"."time_slots"."specific_date" IS 'Used only when slot_type is specific_date';



COMMENT ON COLUMN "public"."time_slots"."created_by" IS 'Admin who created this slot';



CREATE TABLE IF NOT EXISTS "public"."weight_stats" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "weight" numeric(5,2) NOT NULL,
    "body_fat_percentage" numeric(4,2),
    "muscle_mass" numeric(5,2),
    "bone_mass" numeric(4,2),
    "bmi" numeric(4,2),
    "daily_calorie_intake" integer,
    "metabolic_age" integer,
    "total_body_water_percentage" numeric(4,2),
    "recorded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "weight_stats_bmi_check" CHECK ((("bmi" > (0)::numeric) AND ("bmi" < (100)::numeric))),
    CONSTRAINT "weight_stats_body_fat_percentage_check" CHECK ((("body_fat_percentage" >= (0)::numeric) AND ("body_fat_percentage" <= (100)::numeric))),
    CONSTRAINT "weight_stats_bone_mass_check" CHECK ((("bone_mass" >= (0)::numeric) AND ("bone_mass" < (50)::numeric))),
    CONSTRAINT "weight_stats_daily_calorie_intake_check" CHECK ((("daily_calorie_intake" > 0) AND ("daily_calorie_intake" < 10000))),
    CONSTRAINT "weight_stats_metabolic_age_check" CHECK ((("metabolic_age" > 0) AND ("metabolic_age" < 150))),
    CONSTRAINT "weight_stats_muscle_mass_check" CHECK ((("muscle_mass" >= (0)::numeric) AND ("muscle_mass" < (300)::numeric))),
    CONSTRAINT "weight_stats_total_body_water_percentage_check" CHECK ((("total_body_water_percentage" >= (0)::numeric) AND ("total_body_water_percentage" <= (100)::numeric))),
    CONSTRAINT "weight_stats_weight_check" CHECK ((("weight" > (0)::numeric) AND ("weight" < (500)::numeric)))
);


ALTER TABLE "public"."weight_stats" OWNER TO "postgres";


COMMENT ON TABLE "public"."weight_stats" IS 'Almacena las mediciones de composición corporal de los usuarios';



COMMENT ON COLUMN "public"."weight_stats"."weight" IS 'Peso corporal total en kilogramos';



COMMENT ON COLUMN "public"."weight_stats"."body_fat_percentage" IS 'Porcentaje de grasa corporal (0-100)';



COMMENT ON COLUMN "public"."weight_stats"."muscle_mass" IS 'Masa muscular en kilogramos';



COMMENT ON COLUMN "public"."weight_stats"."bone_mass" IS 'Masa ósea en kilogramos';



COMMENT ON COLUMN "public"."weight_stats"."bmi" IS 'Índice de Masa Corporal (kg/m²)';



COMMENT ON COLUMN "public"."weight_stats"."daily_calorie_intake" IS 'Ingesta diaria de calorías recomendada';



COMMENT ON COLUMN "public"."weight_stats"."metabolic_age" IS 'Edad metabólica en años';



COMMENT ON COLUMN "public"."weight_stats"."total_body_water_percentage" IS 'Porcentaje de agua corporal total (0-100)';



COMMENT ON COLUMN "public"."weight_stats"."recorded_at" IS 'Fecha y hora en que se realizó la medición';



COMMENT ON COLUMN "public"."weight_stats"."notes" IS 'Notas adicionales del usuario sobre la medición';



ALTER TABLE ONLY "public"."app_settings"
    ADD CONSTRAINT "app_settings_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."app_settings"
    ADD CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_user_id_time_slot_id_booking_date_key" UNIQUE ("user_id", "time_slot_id", "booking_date");



ALTER TABLE ONLY "public"."branding_settings"
    ADD CONSTRAINT "branding_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."health_check"
    ADD CONSTRAINT "health_check_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_methods"
    ADD CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_requests"
    ADD CONSTRAINT "payment_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pricing_packages"
    ADD CONSTRAINT "pricing_packages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."time_slots"
    ADD CONSTRAINT "time_slots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."weight_stats"
    ADD CONSTRAINT "weight_stats_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_app_settings_key" ON "public"."app_settings" USING "btree" ("key");



CREATE INDEX "idx_bookings_date" ON "public"."bookings" USING "btree" ("booking_date");



CREATE INDEX "idx_bookings_slot" ON "public"."bookings" USING "btree" ("time_slot_id");



CREATE INDEX "idx_bookings_status" ON "public"."bookings" USING "btree" ("status");



CREATE INDEX "idx_bookings_user_id" ON "public"."bookings" USING "btree" ("user_id");



CREATE INDEX "idx_branding_settings_updated_at" ON "public"."branding_settings" USING "btree" ("updated_at" DESC);



CREATE INDEX "idx_payment_methods_active" ON "public"."payment_methods" USING "btree" ("is_active");



CREATE INDEX "idx_payment_methods_display_order" ON "public"."payment_methods" USING "btree" ("display_order");



CREATE INDEX "idx_payment_methods_type" ON "public"."payment_methods" USING "btree" ("type");



CREATE INDEX "idx_payment_requests_payment_method_id" ON "public"."payment_requests" USING "btree" ("payment_method_id");



CREATE INDEX "idx_payment_requests_status" ON "public"."payment_requests" USING "btree" ("status");



CREATE INDEX "idx_payment_requests_user" ON "public"."payment_requests" USING "btree" ("user_id");



CREATE INDEX "idx_pricing_packages_active" ON "public"."pricing_packages" USING "btree" ("is_active");



CREATE INDEX "idx_pricing_packages_display_order" ON "public"."pricing_packages" USING "btree" ("display_order");



CREATE INDEX "idx_profiles_approval_status" ON "public"."profiles" USING "btree" ("approval_status");



CREATE INDEX "idx_profiles_role" ON "public"."profiles" USING "btree" ("role");



CREATE INDEX "idx_time_slots_active" ON "public"."time_slots" USING "btree" ("is_active");



CREATE INDEX "idx_time_slots_day" ON "public"."time_slots" USING "btree" ("day_of_week");



CREATE INDEX "idx_time_slots_specific_date" ON "public"."time_slots" USING "btree" ("specific_date") WHERE ("slot_type" = 'specific_date'::"text");



CREATE INDEX "idx_time_slots_type" ON "public"."time_slots" USING "btree" ("slot_type");



CREATE INDEX "idx_weight_stats_created_at" ON "public"."weight_stats" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_weight_stats_recorded_at" ON "public"."weight_stats" USING "btree" ("recorded_at" DESC);



CREATE INDEX "idx_weight_stats_user_id" ON "public"."weight_stats" USING "btree" ("user_id");



CREATE INDEX "idx_weight_stats_user_recorded" ON "public"."weight_stats" USING "btree" ("user_id", "recorded_at" DESC);



CREATE UNIQUE INDEX "unique_recurring_slots" ON "public"."time_slots" USING "btree" ("day_of_week", "start_time") WHERE ("slot_type" = 'recurring'::"text");



CREATE UNIQUE INDEX "unique_specific_date_slots" ON "public"."time_slots" USING "btree" ("specific_date", "start_time") WHERE ("slot_type" = 'specific_date'::"text");



CREATE OR REPLACE TRIGGER "app_settings_updated_at" BEFORE UPDATE ON "public"."app_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_app_settings_updated_at"();



CREATE OR REPLACE TRIGGER "booking_deduct_credit" AFTER INSERT ON "public"."bookings" FOR EACH ROW EXECUTE FUNCTION "public"."handle_booking_credit_deduction"();



CREATE OR REPLACE TRIGGER "booking_refund_credit" AFTER UPDATE ON "public"."bookings" FOR EACH ROW WHEN (("old"."status" IS DISTINCT FROM "new"."status")) EXECUTE FUNCTION "public"."handle_booking_cancellation_refund"();



CREATE OR REPLACE TRIGGER "trigger_update_branding_settings_updated_at" BEFORE UPDATE ON "public"."branding_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_branding_settings_updated_at"();



CREATE OR REPLACE TRIGGER "update_bookings_updated_at" BEFORE UPDATE ON "public"."bookings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_payment_requests_updated_at" BEFORE UPDATE ON "public"."payment_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_time_slots_updated_at" BEFORE UPDATE ON "public"."time_slots" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_weight_stats_updated_at_trigger" BEFORE UPDATE ON "public"."weight_stats" FOR EACH ROW EXECUTE FUNCTION "public"."update_weight_stats_updated_at"();



ALTER TABLE ONLY "public"."app_settings"
    ADD CONSTRAINT "app_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "public"."time_slots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_requests"
    ADD CONSTRAINT "payment_requests_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."payment_requests"
    ADD CONSTRAINT "payment_requests_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."payment_requests"
    ADD CONSTRAINT "payment_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."time_slots"
    ADD CONSTRAINT "time_slots_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."weight_stats"
    ADD CONSTRAINT "weight_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can delete bookings" ON "public"."bookings" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can delete payment requests" ON "public"."payment_requests" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can delete time slots" ON "public"."time_slots" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can insert bookings for any user" ON "public"."bookings" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can insert time slots" ON "public"."time_slots" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can update all bookings" ON "public"."bookings" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can update all profiles" ON "public"."profiles" FOR UPDATE USING ("public"."is_admin"());



CREATE POLICY "Admins can update payment requests" ON "public"."payment_requests" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can update time slots" ON "public"."time_slots" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can view all bookings" ON "public"."bookings" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can view all payment requests" ON "public"."payment_requests" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can view all time slots" ON "public"."time_slots" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can view all weight stats" ON "public"."weight_stats" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Allow public read access" ON "public"."health_check" FOR SELECT USING (true);



CREATE POLICY "Anyone can read app settings" ON "public"."app_settings" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Anyone can read branding settings" ON "public"."branding_settings" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Approved users can create own bookings" ON "public"."bookings" FOR INSERT WITH CHECK (((("auth"."uid"() = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."approval_status" = 'approved'::"text"))))) OR ("auth"."uid"() = "created_by")));



CREATE POLICY "Approved users can create payment requests" ON "public"."payment_requests" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."approval_status" = 'approved'::"text"))))));



CREATE POLICY "Approved users can view active time slots" ON "public"."time_slots" FOR SELECT USING ((("is_active" = true) AND ("auth"."uid"() IS NOT NULL) AND ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."approval_status" = 'approved'::"text")))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))))));



CREATE POLICY "Only admins can delete app settings" ON "public"."app_settings" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Only admins can delete branding settings" ON "public"."branding_settings" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Only admins can insert app settings" ON "public"."app_settings" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Only admins can insert branding settings" ON "public"."branding_settings" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Only admins can update app settings" ON "public"."app_settings" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Only admins can update branding settings" ON "public"."branding_settings" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Users can create their own weight stats" ON "public"."weight_stats" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own weight stats" ON "public"."weight_stats" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own basic info" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK ((("auth"."uid"() = "id") AND ("role" = ( SELECT "profiles_1"."role"
   FROM "public"."profiles" "profiles_1"
  WHERE ("profiles_1"."id" = "auth"."uid"()))) AND ("credits" = ( SELECT "profiles_1"."credits"
   FROM "public"."profiles" "profiles_1"
  WHERE ("profiles_1"."id" = "auth"."uid"())))));



CREATE POLICY "Users can update own bookings" ON "public"."bookings" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK ((("auth"."uid"() = "id") AND ("role" = 'user'::"text")));



CREATE POLICY "Users can update their own weight stats" ON "public"."weight_stats" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own bookings" ON "public"."bookings" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own payment requests" ON "public"."payment_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING ((("auth"."uid"() = "id") OR "public"."is_admin"()));



CREATE POLICY "Users can view their own weight stats" ON "public"."weight_stats" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."app_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."branding_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."health_check" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_methods" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "payment_methods_delete_admin" ON "public"."payment_methods" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "payment_methods_insert_admin" ON "public"."payment_methods" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "payment_methods_select_active" ON "public"."payment_methods" FOR SELECT TO "authenticated" USING (("is_active" = true));



CREATE POLICY "payment_methods_select_all_admin" ON "public"."payment_methods" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "payment_methods_update_admin" ON "public"."payment_methods" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



ALTER TABLE "public"."payment_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pricing_packages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "pricing_packages_delete_admin" ON "public"."pricing_packages" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "pricing_packages_insert_admin" ON "public"."pricing_packages" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "pricing_packages_select_active" ON "public"."pricing_packages" FOR SELECT TO "authenticated" USING (("is_active" = true));



CREATE POLICY "pricing_packages_select_all_admin" ON "public"."pricing_packages" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "pricing_packages_update_admin" ON "public"."pricing_packages" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."time_slots" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."weight_stats" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."admin_create_user"("p_email" "text", "p_password" "text", "p_full_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_create_user"("p_email" "text", "p_password" "text", "p_full_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_create_user"("p_email" "text", "p_password" "text", "p_full_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_delete_user"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_delete_user"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_delete_user"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."approve_user"("target_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."approve_user"("target_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."approve_user"("target_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_age"("birth_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_age"("birth_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_age"("birth_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_weight_change"("p_user_id" "uuid", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_weight_change"("p_user_id" "uuid", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_weight_change"("p_user_id" "uuid", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_admin_dashboard_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_admin_dashboard_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_admin_dashboard_data"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_admin_secondary_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_admin_secondary_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_admin_secondary_data"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_available_spots"("slot_id" "uuid", "target_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."get_available_spots"("slot_id" "uuid", "target_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_available_spots"("slot_id" "uuid", "target_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_latest_weight_stat"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_latest_weight_stat"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_latest_weight_stat"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_weight_stats_by_date_range"("p_user_id" "uuid", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."get_weight_stats_by_date_range"("p_user_id" "uuid", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_weight_stats_by_date_range"("p_user_id" "uuid", "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_booking_cancellation_refund"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_booking_cancellation_refund"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_booking_cancellation_refund"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_booking_credit_deduction"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_booking_credit_deduction"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_booking_credit_deduction"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."reject_user"("target_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."reject_user"("target_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."reject_user"("target_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_app_settings_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_app_settings_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_app_settings_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_branding_settings_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_branding_settings_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_branding_settings_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_weight_stats_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_weight_stats_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_weight_stats_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."app_settings" TO "anon";
GRANT ALL ON TABLE "public"."app_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."app_settings" TO "service_role";



GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";



GRANT ALL ON TABLE "public"."branding_settings" TO "anon";
GRANT ALL ON TABLE "public"."branding_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."branding_settings" TO "service_role";



GRANT ALL ON TABLE "public"."health_check" TO "anon";
GRANT ALL ON TABLE "public"."health_check" TO "authenticated";
GRANT ALL ON TABLE "public"."health_check" TO "service_role";



GRANT ALL ON TABLE "public"."payment_methods" TO "anon";
GRANT ALL ON TABLE "public"."payment_methods" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_methods" TO "service_role";



GRANT ALL ON TABLE "public"."payment_requests" TO "anon";
GRANT ALL ON TABLE "public"."payment_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_requests" TO "service_role";



GRANT ALL ON TABLE "public"."pricing_packages" TO "anon";
GRANT ALL ON TABLE "public"."pricing_packages" TO "authenticated";
GRANT ALL ON TABLE "public"."pricing_packages" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."time_slots" TO "anon";
GRANT ALL ON TABLE "public"."time_slots" TO "authenticated";
GRANT ALL ON TABLE "public"."time_slots" TO "service_role";



GRANT ALL ON TABLE "public"."weight_stats" TO "anon";
GRANT ALL ON TABLE "public"."weight_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."weight_stats" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































