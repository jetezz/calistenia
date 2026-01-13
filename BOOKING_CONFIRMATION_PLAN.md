# Desarrollo: Configuración de Confirmación de Reservas

## 1. Contexto y Tipos

El objetivo es permitir al administrador decidir si las reservas de los clientes se confirman automáticamente o requieren confirmación manual.
Actualmente, las reservas se crean con estado `confirmed` por defecto (implícito o explícito).
Necesitamos introducir un estado `pending` y una configuración global.

### `src/types/database.ts`

La tabla `app_settings` es clave para almacenar la configuración.
Tabla `bookings` tiene columna `status` (string).

```typescript
// src/types/database.ts (Referencias)

// Tabla app_settings
export type AppSetting = {
  key: string;
  value: Json; // { value: boolean } para "booking_auto_confirm"
  // ...
};

// Tabla bookings
export type Booking = {
  id: string;
  status: string; // "confirmed", "cancelled", "pending" (nuevo)
  // ...
};
```

## 2. Análisis de Migración

**Necesario**: Sí, pero de datos, no de esquema estructural (la tabla `app_settings` ya existe).
Debemos insertar la configuración inicial para mantener la compatibilidad hacia atrás.

**Comando Supabase**:
No se requiere `supabase migration new` si insertamos el dato vía script o manualmente, pero para persistencia es mejor una migración.
Generaremos una migración SQL para insertar:
`INSERT INTO public.app_settings (key, value) VALUES ('booking_auto_confirm', 'true') ON CONFLICT (key) DO NOTHING;`

## 3. Análisis de Services

**Modificar**: `src/services/bookingService.ts`
El servicio `create` es "tonto", solo inserta.
Opción A: Modificar `create` para leer settings (acopla servicios).
Opción B: Modificar quien llama a `create` (Store).
**Decisión**: Mantener servicio simple. La lógica de negocio va en el Store.
Sin embargo, necesitamos asegurarnos de que `getUpcomingByUserId` traiga las reservas pendientes si queremos que el usuario las vea.
Actualizar `getUpcomingByUserId` para incluir `pending`.

## 4. Análisis de Stores

**Modificar**: `src/stores/bookingStore.ts`
Sobrescribir el método `create` del `baseStore`.

1. Obtener el valor de `booking_auto_confirm` usando `useAppSettingsStore`.
2. Si es true -> status `confirmed`.
3. Si es false -> status `pending`.
4. Llamar a `bookingService.create` con el status correcto.

**Modificar**: `src/stores/appSettingsStore.ts`
Ya tiene `getSettingValue`. Asegurarse de que cargue al inicio.

## 5. Análisis de Hooks

No se prevén cambios drásticos en hooks, salvo que `useBookings` utilice selectores específicos que filtren por estado. Revisar si hay hooks que asumen `confirmed` siempre.

## 6. UX Cliente y Admin

**Admin**:

- `/app/admin/settings`: Nuevo toggle "Confirmación automática de reservas".
- `/app/admin/bookings`:
  - Visualizar reservas "Pendientes" (color amarillo/naranja).
  - Botón para "Confirmar" reserva pendiente.
  - Notificación al usuario al confirmar (opcional, pero deseable).

**Cliente**:

- `/app/book`:
  - Feedback inmediato: "Reserva solicitada" en lugar de "Confirmada" si es manual.
  - Lista de reservas: Diferenciar visualmente "Confirmada" (verde) vs "Pendiente" (amarillo).

## 7. Fases y Tareas

### Fase 1: Base de Datos y Lógica

- [x] **Tarea 1.1**: Crear migración SQL para `booking_auto_confirm`.
- [x] **Tarea 1.2**: Modificar `src/stores/bookingStore.ts` para implementar la lógica de creación condicional.

### Fase 2: UI Admin - Configuración

- [x] **Tarea 2.1**: Añadir pestaña/sección "Reservas" en `SettingsPage.tsx`.
- [x] **Tarea 2.2**: Implementar toggle conectado a `appSettingsStore`.

### Fase 3: UI Cliente - Visualización

- [x] **Tarea 3.1**: Actualizar `BookingCard` o lista de reservas para soportar estado `pending`.
- [x] **Tarea 3.2**: Verificar feedback al crear reserva (Toast/Modal).

### Fase 4: UI Admin - Gestión de Reservas

- [x] **Tarea 4.1**: Modificar vista de reservas para agrupar o destacar pendientes.
- [x] **Tarea 4.2**: Implementar acción de "Confirmar" en reservas pendientes.

---
