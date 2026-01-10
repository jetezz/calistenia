-- Add mobile_quick_actions to app_settings
INSERT INTO public.app_settings (key, value, description)
VALUES (
  'mobile_quick_actions',
  '["/app/admin", "/app/admin/slots", "/app/admin/users", "/app/admin/bookings"]'::json,
  'Configuración de acciones rápidas del menú móvil'
) ON CONFLICT (key) DO NOTHING;
