# Configuración de Supabase Storage para Branding

## ⚠️ Problema

El error "Bucket not found" indica que el bucket de Supabase Storage no existe.

## ✅ Solución

Necesitas crear el bucket en Supabase Storage. Sigue estos pasos:

### Opción 1: Crear Bucket desde el Dashboard de Supabase (Recomendado)

1. **Ir a Supabase Dashboard**

   - Abre https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Ir a Storage**

   - En el menú lateral, click en "Storage"

3. **Crear Nuevo Bucket**

   - Click en "New bucket"
   - Nombre: `branding`
   - Public bucket: ✅ **SÍ** (marcar como público)
   - Click en "Create bucket"

4. **Configurar Políticas (RLS)**
   - El bucket debe ser público para lectura
   - Solo admin puede subir/eliminar

### Opción 2: Crear Bucket con SQL

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- Create branding bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding', 'branding', true);

-- Allow public access to read files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'branding');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'branding');

-- Allow admin to delete
CREATE POLICY "Admin can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'branding' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admin to update
CREATE POLICY "Admin can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'branding' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

### Opción 3: Usar el bucket "public" existente

Si ya tienes un bucket llamado "public", puedes usar ese. El código ya está configurado para usarlo.

**Verificar si existe el bucket "public":**

1. Ir a Storage en Supabase Dashboard
2. Buscar un bucket llamado "public"
3. Si existe, asegúrate de que sea público

**Si no existe, créalo:**

- Nombre: `public`
- Public bucket: ✅ SÍ

## 🔍 Verificación

Después de crear el bucket, verifica:

1. **En Supabase Dashboard > Storage**

   - Deberías ver el bucket "branding" o "public"
   - Debe estar marcado como "Public"

2. **Probar Upload**
   - Ir a `/app/admin/settings`
   - Intentar subir una imagen
   - Debería funcionar sin errores

## 📝 Estructura de Archivos

Las imágenes se guardarán en:

```
branding/
  ├── logo-[timestamp].png
  ├── hero-[timestamp].jpg
  ├── trainer-[timestamp].png
  └── group-[timestamp].jpg
```

## 🔐 Políticas de Seguridad

- ✅ **Lectura**: Cualquiera (público)
- ✅ **Escritura**: Solo usuarios autenticados
- ✅ **Eliminación**: Solo admin
- ✅ **Actualización**: Solo admin

## ⚡ Solución Rápida

Si tienes prisa, ejecuta esto en el SQL Editor de Supabase:

```sql
-- Crear bucket público
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir lectura pública
CREATE POLICY IF NOT EXISTS "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'branding');

-- Permitir upload a autenticados
CREATE POLICY IF NOT EXISTS "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'branding');
```

Luego recarga la página y vuelve a intentar subir la imagen.
