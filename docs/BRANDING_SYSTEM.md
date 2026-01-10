# Sistema de Branding Configurable

## 📋 Descripción

Sistema completo para gestionar toda la información de marca y contacto de la aplicación desde el panel de administración. Permite editar textos, imágenes, información de contacto y controlar la visibilidad de cada elemento en la landing page y la aplicación.

## 🎯 Objetivo

Permitir que el administrador pueda personalizar completamente la marca sin necesidad de modificar código, incluyendo:

- Logo y nombre del negocio
- Imágenes (hero, entrenador, grupo)
- Información de contacto (email, teléfono, WhatsApp, Instagram)
- Ubicación y dirección
- Horarios de atención
- Textos de la landing page (títulos, descripciones, testimonios)
- Control de visibilidad de cada elemento

## 🗂️ Estructura de Datos

### Tabla: `branding_settings`

Almacena toda la configuración de marca de la aplicación.

#### Campos Principales

**Identidad de Marca:**

- `business_name` - Nombre del negocio
- `logo_url` - URL del logo
- `show_logo` - Visibilidad del logo

**Imágenes:**

- `hero_image_url` - Imagen principal del hero
- `trainer_image_url` - Foto del entrenador
- `group_image_url` - Foto del grupo entrenando
- `show_hero_image` - Visibilidad imagen hero
- `show_trainer_image` - Visibilidad imagen entrenador
- `show_group_image` - Visibilidad imagen grupo

**Información de Contacto:**

- `email` - Correo electrónico
- `phone` - Teléfono
- `whatsapp` - Número de WhatsApp
- `instagram` - Usuario de Instagram
- `show_email` - Visibilidad email
- `show_phone` - Visibilidad teléfono
- `show_whatsapp` - Visibilidad WhatsApp
- `show_instagram` - Visibilidad Instagram

**Ubicación:**

- `address` - Dirección completa
- `city` - Ciudad
- `region` - Región/Provincia
- `country` - País
- `google_maps_url` - URL de Google Maps
- `show_location` - Visibilidad ubicación

**Horarios:**

- `schedule_weekdays` - Horario entre semana
- `schedule_saturday` - Horario sábados
- `schedule_sunday` - Horario domingos
- `show_schedule` - Visibilidad horarios

**Textos de Landing Page:**

- `hero_title` - Título principal del hero
- `hero_subtitle` - Subtítulo del hero
- `hero_cta_text` - Texto del botón CTA
- `value_prop_title` - Título propuesta de valor
- `about_trainer_text` - Texto sobre el entrenador
- `about_trainer_quote` - Cita del entrenador

**Testimonios:**

- `testimonials` - JSON array con testimonios
  ```json
  [
    {
      "name": "María, 47 años",
      "role": "Funcionaria pública",
      "text": "Testimonio...",
      "visible": true
    }
  ]
  ```

**Metadata:**

- `created_at` - Fecha de creación
- `updated_at` - Fecha de última actualización

## 🏗️ Arquitectura

### 1. Base de Datos (Supabase)

- **Migration**: `20260110_create_branding_settings.sql`
- **Tabla**: `branding_settings`
- **RLS**: Solo admin puede editar, todos pueden leer

### 2. Services

- **Archivo**: `src/services/brandingService.ts`
- **Funciones**:
  - `getBrandingSettings()` - Obtener configuración
  - `updateBrandingSettings(data)` - Actualizar configuración
  - `uploadBrandingImage(file, type)` - Subir imagen

### 3. Store (Zustand)

- **Archivo**: `src/stores/brandingStore.ts`
- **Estado**:
  - `settings` - Configuración actual
  - `isLoading` - Estado de carga
  - `error` - Errores
- **Acciones**:
  - `fetchSettings()` - Cargar configuración
  - `updateSettings(data)` - Actualizar configuración
  - `uploadImage(file, type)` - Subir imagen

### 4. Hooks

- **Archivo**: `src/hooks/admin/Branding/useBrandingSettings.ts`
- **Hook**: `useBrandingSettings()`
- **Retorna**:
  - `settings` - Configuración actual
  - `isLoading` - Estado de carga
  - `updateSettings` - Función para actualizar
  - `uploadImage` - Función para subir imágenes

### 5. Componentes UI

#### Página de Configuración

- **Archivo**: `src/screens/admin/Settings/SettingsPage.tsx`
- **Secciones**:
  1. Identidad de Marca (logo, nombre)
  2. Imágenes (hero, entrenador, grupo)
  3. Información de Contacto
  4. Ubicación
  5. Horarios
  6. Textos de Landing Page
  7. Testimonios

#### Componentes de Formulario

- **ImageUpload**: Input para subir imágenes con preview
- **VisibilityToggle**: Switch para mostrar/ocultar elementos
- **TestimonialEditor**: Editor de testimonios con array dinámico

### 6. Landing Page Actualizada

- **Archivo**: `src/screens/LandingPage.tsx`
- **Cambios**:
  - Usar `useBrandingSettings()` para obtener datos
  - Renderizar condicionalmente según visibilidad
  - Mostrar placeholders si no hay datos

## 📊 Flujo de Datos

```
Admin Panel (Settings Page)
    ↓
useBrandingSettings Hook
    ↓
brandingStore (Zustand)
    ↓
brandingService
    ↓
Supabase Database
    ↓
Landing Page / App
```

## 🔐 Seguridad

### Row Level Security (RLS)

```sql
-- Solo admin puede actualizar
CREATE POLICY "Admin can update branding"
ON branding_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Todos pueden leer (para la landing page pública)
CREATE POLICY "Anyone can read branding"
ON branding_settings
FOR SELECT
TO anon, authenticated
USING (true);
```

## 🎨 UX/UI

### Página de Configuración

#### Layout

- Tabs para organizar secciones
- Formulario con validación
- Preview en tiempo real
- Botón "Guardar cambios" sticky

#### Componentes

**1. Sección de Identidad**

```tsx
- Input: Nombre del negocio
- ImageUpload: Logo
- Toggle: Mostrar logo
```

**2. Sección de Imágenes**

```tsx
- ImageUpload: Imagen Hero
  - Toggle: Mostrar
- ImageUpload: Foto Entrenador
  - Toggle: Mostrar
- ImageUpload: Foto Grupo
  - Toggle: Mostrar
```

**3. Sección de Contacto**

```tsx
- Input Email
  - Toggle: Mostrar
- Input Teléfono
  - Toggle: Mostrar
- Input WhatsApp
  - Toggle: Mostrar
- Input Instagram
  - Toggle: Mostrar
```

**4. Sección de Ubicación**

```tsx
- Input: Dirección
- Input: Ciudad
- Input: Región
- Input: País
- Input: URL Google Maps
- Toggle: Mostrar ubicación
```

**5. Sección de Horarios**

```tsx
- Input: Lunes-Viernes
- Input: Sábados
- Input: Domingos
- Toggle: Mostrar horarios
```

**6. Sección de Textos**

```tsx
- Textarea: Título Hero
- Textarea: Subtítulo Hero
- Input: Texto botón CTA
- Textarea: Título propuesta de valor
- Textarea: Sobre el entrenador
- Input: Cita del entrenador
```

**7. Sección de Testimonios**

```tsx
- Array dinámico:
  - Input: Nombre
  - Input: Rol
  - Textarea: Testimonio
  - Toggle: Visible
  - Botón: Eliminar
- Botón: Añadir testimonio
```

## 📝 Tipos TypeScript

```typescript
export interface BrandingSettings {
  id: string;

  // Identidad
  business_name: string;
  logo_url: string | null;
  show_logo: boolean;

  // Imágenes
  hero_image_url: string | null;
  trainer_image_url: string | null;
  group_image_url: string | null;
  show_hero_image: boolean;
  show_trainer_image: boolean;
  show_group_image: boolean;

  // Contacto
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  show_email: boolean;
  show_phone: boolean;
  show_whatsapp: boolean;
  show_instagram: boolean;

  // Ubicación
  address: string | null;
  city: string;
  region: string;
  country: string;
  google_maps_url: string | null;
  show_location: boolean;

  // Horarios
  schedule_weekdays: string | null;
  schedule_saturday: string | null;
  schedule_sunday: string | null;
  show_schedule: boolean;

  // Textos
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  value_prop_title: string;
  about_trainer_text: string | null;
  about_trainer_quote: string | null;

  // Testimonios
  testimonials: Testimonial[];

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  visible: boolean;
}
```

## 🚀 Implementación

### Orden de Desarrollo

1. ✅ **Migration de Base de Datos**

   - Crear tabla `branding_settings`
   - Configurar RLS
   - Insertar datos por defecto

2. ✅ **Types**

   - Definir interfaces TypeScript

3. ✅ **Service Layer**

   - Implementar `brandingService.ts`
   - Funciones CRUD
   - Upload de imágenes

4. ✅ **Store (Zustand)**

   - Crear `brandingStore.ts`
   - Estado global
   - Acciones

5. ✅ **Hooks**

   - Crear `useBrandingSettings.ts`
   - Lógica de negocio

6. ✅ **UI Components**

   - `ImageUpload.tsx`
   - `VisibilityToggle.tsx`
   - `TestimonialEditor.tsx`

7. ✅ **Settings Page**

   - Implementar formulario completo
   - Validación
   - Preview

8. ✅ **Landing Page**
   - Integrar con branding store
   - Renderizado condicional
   - Fallbacks

## 🧪 Testing

### Casos de Prueba

1. **Carga de Configuración**

   - [ ] Cargar configuración existente
   - [ ] Manejar configuración vacía
   - [ ] Error de conexión

2. **Actualización de Datos**

   - [ ] Actualizar texto
   - [ ] Actualizar imagen
   - [ ] Toggle de visibilidad
   - [ ] Validación de campos

3. **Upload de Imágenes**

   - [ ] Subir imagen válida
   - [ ] Rechazar archivo no válido
   - [ ] Preview de imagen
   - [ ] Eliminar imagen

4. **Testimonios**

   - [ ] Añadir testimonio
   - [ ] Editar testimonio
   - [ ] Eliminar testimonio
   - [ ] Toggle visibilidad

5. **Landing Page**
   - [ ] Mostrar datos actualizados
   - [ ] Ocultar elementos no visibles
   - [ ] Fallback a valores por defecto

## 📦 Dependencias

No se requieren nuevas dependencias. Usamos:

- Supabase (ya instalado)
- Zustand (ya instalado)
- React Hook Form (ya instalado)
- Shadcn UI (ya instalado)

## 🔄 Migración de Datos Existentes

Los datos actuales hardcodeados en la landing page se migrarán como valores por defecto en la tabla `branding_settings`.

## 📚 Documentación Adicional

- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
