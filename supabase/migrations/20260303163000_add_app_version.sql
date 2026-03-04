INSERT INTO public.app_settings (key, value)
VALUES ('app-version', '"1.0.0"'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Permitir a anon leer app_settings (importante para cuando la app inicia sin sesión)
CREATE POLICY "Anyone can read app settings anon" ON "public"."app_settings" FOR SELECT TO "anon" USING (true);

-- Crear bucket de releases
INSERT INTO storage.buckets (id, name, public)
VALUES ('releases', 'releases', true)
ON CONFLICT (id) DO NOTHING;

-- Crear políticas de storage para el bucket 'releases'
CREATE POLICY "Public Access to releases"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'releases');

CREATE POLICY "Authenticated users can upload releases"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'releases');

CREATE POLICY "Authenticated users can update releases"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'releases');

CREATE POLICY "Authenticated users can delete releases"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'releases');
