CREATE OR REPLACE FUNCTION "public"."handle_booking_credit_deduction"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Check if it's a new confirmed booking OR an existing booking changing to confirmed
    IF (NEW.status = 'confirmed' AND (TG_OP = 'INSERT' OR OLD.status != 'confirmed')) THEN
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
