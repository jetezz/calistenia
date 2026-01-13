INSERT INTO public.app_settings (key, value, description)
VALUES ('booking_auto_confirm', 'true'::jsonb, 'Automatically confirm bookings upon creation')
ON CONFLICT (key) DO NOTHING;
