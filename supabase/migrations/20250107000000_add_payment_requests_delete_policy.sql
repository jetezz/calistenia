-- Add DELETE policy for payment_requests table
-- This allows admins to delete payment requests

CREATE POLICY "Admins can delete payment requests"
    ON public.payment_requests FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
