-- =============================================
-- AUTOMATIC CREDIT MANAGEMENT FOR BOOKINGS
-- =============================================

-- Function to deduct credit when booking is created
CREATE OR REPLACE FUNCTION handle_booking_credit_deduction()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refund credit when booking is cancelled
CREATE OR REPLACE FUNCTION handle_booking_cancellation_refund()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status = 'confirmed' THEN
        UPDATE public.profiles
        SET credits = credits + 1
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to deduct credit on booking creation
CREATE TRIGGER booking_deduct_credit
    AFTER INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION handle_booking_credit_deduction();

-- Trigger to refund credit on booking cancellation
CREATE TRIGGER booking_refund_credit
    AFTER UPDATE ON public.bookings
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION handle_booking_cancellation_refund();

COMMENT ON FUNCTION handle_booking_credit_deduction() IS 'Automatically deducts 1 credit when a confirmed booking is created';
COMMENT ON FUNCTION handle_booking_cancellation_refund() IS 'Automatically refunds 1 credit when a confirmed booking is cancelled';
