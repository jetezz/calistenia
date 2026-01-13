# Implementación de Cambio de Vista Admin/Cliente

## 1. Contexto

El objetivo de este desarrollo es permitir a los administradores cambiar fácilmente entre la vista del Panel de Administración (Admin Dashboard) y la Vista de Cliente (App principal).
Actualmente, la navegación automática dirige al admin al panel, pero no hay un mecanismo explícito y rápido para volver a la vista de cliente sin escribir la URL manualmente o realizar pasos complejos.
Se requiere un botón visible tanto en el panel como en la vista de inicio que permita esta transición.

## 2. Solución Propuesta

## 2. Solución Propuesta (Actualizada)

Para evitar bucles de redirección automática (donde el Admin es redirigido automáticamente del Home al Dashboard), se implementa un mecanismo de estado `viewMode` en `ProfileStore`.

- **Estado**: `viewMode` ("default" | "client").
- **Comportamiento**:
  - Por defecto es "default".
  - Si un Admin entra en `HomePage` (`/app`) y `viewMode` es "default", es redirigido al Dashboard.
  - Si un Admin pulsa "Vista Cliente", se actualiza `viewMode` a "client" y se navega a `/app`.
  - `HomePage` detecta `viewMode === "client"` y permite la visualización sin redirigir.
  - El botón "Vista Admin" devuelve el estado a "default" y navega al Dashboard.

Esta solución es robusta, mantiene el dashboard como vista predeterminada al recargar (seguridad/ux por defecto) y permite la navegación fluida sin parámetros de URL que se pierden al navegar entre páginas internas.

## 3. Migraciones

No es necesario generar ninguna migración de base de datos.

## 4. Servicios

No es necesario modificar los servicios.

## 5. Stores

- **ProfileStore**: Se añade `viewMode` y `setViewMode` para gestionar la preferencia de vista en la sesión actual.

## 6. Hooks

- **useProfile**: Se expone `viewMode` para facilitar el acceso desde los componentes.

## 7. UX

- **Ubicación**: Barra superior (Header).
- **Interacción**: Botón con feedback visual de estado.

## 8. Fases y Tareas

- [x] Crear el desarrollo
  - [x] Añadir user story y analisis al readme.
  - [x] Modificar `profileStore` para incluir `viewMode`.
  - [x] Actualizar `useProfile` hook.
  - [x] Implementar lógica en `Header.tsx` para cambiar el modo.
  - [x] Actualizar `HomePage.tsx` para condicionar la redirección.
