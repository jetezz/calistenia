set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_available_spots_batch(start_date date, end_date date)
 RETURNS TABLE(time_slot_id uuid, booking_date date, booked integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        b.time_slot_id, 
        b.booking_date, 
        CAST(COUNT(*) AS integer) AS booked
    FROM public.bookings b
    WHERE b.booking_date >= start_date 
      AND b.booking_date <= end_date 
      AND b.status = 'confirmed'
    GROUP BY b.time_slot_id, b.booking_date;
END;
$function$
;


