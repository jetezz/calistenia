-- Drop the old trigger that causes double credit deduction
DROP TRIGGER IF EXISTS booking_deduct_credit ON public.bookings;
