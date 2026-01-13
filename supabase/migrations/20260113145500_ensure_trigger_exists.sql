DROP TRIGGER IF EXISTS on_booking_credit_deduction ON public.bookings;

CREATE TRIGGER on_booking_credit_deduction
    BEFORE INSERT OR UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_booking_credit_deduction();
