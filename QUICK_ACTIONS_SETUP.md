# Configuración de Acciones Rápidas (Mobile Menu)

Este documento detalla la implementación de la funcionalidad que permite al administrador configurar las acciones rápidas del menú inferior en la versión móvil.

## Contexto

El objetivo es permitir que el administrador decida qué 4 accesos directos aparecen en el menú de navegación inferior cuando se está en modo admin. Anteriormente, estos accesos estaban hardcodeados.

## Implementación

### 1. Base de Datos

- Tabla `app_settings`: Se utiliza esta tabla existente para almacenar la configuración.
- Key: `mobile_quick_actions`
- Value: Array de strings (rutas), ej: `["/app/admin", "/app/admin/users", ...]`

### 2. Archivos Modificados/Creados

#### Tipos

- `src/types/navigation.ts`: Define las acciones disponibles (`ADMIN_AVAILABLE_ACTIONS`) y el mapa de iconos (`ICONS`).

#### Store

- `src/stores/appSettingsStore.ts`: Se añadieron métodos `getQuickActions` y `updateQuickActions` para leer y escribir esta configuración específica manteniendo el tipado.

#### Hooks

- `src/hooks/admin/Settings/useAdminSettingsLogic.ts`: Se expusieron las funciones del store para ser consumidas por la página de configuración.

#### Componentes (UX)

- `src/screens/admin/Settings/SettingsPage.tsx`: Se añadió una nueva pestaña "Navegación" donde el admin puede activar/desactivar opciones mediante checkboxes, con un límite de 4 selecciones.
- `src/components/layout/MobileNav.tsx`: Se actualizó para leer las acciones desde el store y renderizar dinámicamente los ítems del menú correspondientes.

## Pasos Realizados

- [x] Análisis del esquema de base de datos (`src/types/database.ts`).
- [x] Creación de migración SQL (`supabase/migrations/20260111100000_mobile_quick_actions.sql`) para establecer valores por defecto.
- [x] Creación de definiciones de tipos y constantes de navegación (`src/types/navigation.ts`).
- [x] Actualización del store (`src/stores/appSettingsStore.ts`) para manejar la lógica de acciones rápidas.
- [x] Actualización del hook de lógica de administración (`src/hooks/admin/Settings/useAdminSettingsLogic.ts`).
- [x] Implementación de la UI de configuración en `SettingsPage.tsx`.
- [x] Implementación del renderizado dinámico en `MobileNav.tsx`.

## Cómo Probar

1. Navegar a `/app/admin/settings` (Configuración).
2. Ir a la pestaña "Navegación".
3. Seleccionar/Deseleccionar opciones. Verificar que no deja seleccionar más de 4.
4. Guardar cambios (o esperar si es optimista).
5. Verificar en el menú inferior (en vista móvil) que los iconos cambian según la selección.
