# Sistema de Aprobación de Usuarios - Desarrollo

## Objetivo
Implementar un sistema de aprobación donde los nuevos usuarios deben ser autorizados por un administrador antes de poder utilizar la aplicación.

## Flujo de Usuario

### 1. Registro de Usuario
- Un nuevo usuario se registra en la aplicación
- El usuario es creado pero con estado "pendiente de aprobación"

### 2. Estado de Espera
- El usuario no puede acceder a las funcionalidades de la aplicación
- Se muestra un mensaje indicando que debe esperar la aprobación del administrador

### 3. Aprobación por Admin
- El administrador puede ver la lista de usuarios pendientes
- El administrador aprueba o rechaza al usuario
- El administrador puede cambiar el estado en cualquier momento:
  - **Usuarios pendientes**: Pueden ser aprobados o rechazados
  - **Usuarios rechazados**: Pueden ser aprobados o vueltos a poner en pendiente
  - **Usuarios aprobados**: Pueden ser rechazados o vueltos a poner en pendiente

### 4. Acceso Completo
- Una vez aprobado, el usuario puede utilizar la aplicación sin restricciones
- El usuario accede a todas las funcionalidades normalmente

---

## Tareas de Desarrollo

### ✅ Phase 1: README y Planificación
- [x] Crear documento de desarrollo
- [x] Análisis de contexto completo

### ✅ Phase 2: Base de Datos
- [x] Analizar estructura actual de la tabla `profiles`
- [x] Agregar campo `approval_status` a la tabla `profiles`
- [x] Generar migration SQL para Supabase ([20260110000000_add_user_approval.sql](supabase/migrations/20260110000000_add_user_approval.sql))
- [x] Actualizar [types/database.ts](src/types/database.ts)
- [x] Crear funciones RPC para aprobar/rechazar usuarios
- [x] Actualizar RLS policies para verificar `approval_status`

### ✅ Phase 3: Services
- [x] Agregar `updateApprovalStatus` a [profileService.ts](src/services/profileService.ts)
- [x] Agregar `approveUser` a profileService
- [x] Agregar `rejectUser` a profileService

### ✅ Phase 4: Stores
- [x] Agregar `updateApprovalStatus` a [profileStore.ts](src/stores/profileStore.ts)
- [x] Agregar `approveUser` a profileStore
- [x] Agregar `rejectUser` a profileStore

### ✅ Phase 5: Hooks
- [x] Actualizar [useProfile.ts](src/features/auth/hooks/useProfile.ts) con estados de aprobación
- [x] Modificar [AuthGuard.tsx](src/features/auth/components/AuthGuard.tsx) para validar approval_status
- [x] Actualizar [useAdminUsersLogic.ts](src/hooks/admin/Users/useAdminUsersLogic.ts) para incluir filtros y métodos de aprobación

### ✅ Phase 6: UX/UI
- [x] Crear [PendingApprovalPage.tsx](src/screens/client/PendingApproval/PendingApprovalPage.tsx) - Pantalla de usuario pendiente
- [x] Crear [RejectedPage.tsx](src/screens/client/Rejected/RejectedPage.tsx) - Pantalla de usuario rechazado
- [x] Actualizar [UsersPage.tsx](src/screens/admin/Users/UsersPage.tsx) con controles de aprobación/rechazo
- [x] Agregar filtros por estado de aprobación en panel de admin
- [x] Agregar badges visuales de estado de aprobación
- [x] Agregar rutas `/pending-approval` y `/rejected` en [router/index.tsx](src/app/router/index.tsx)

### Phase 7: Testing y Validación
- [ ] **PENDIENTE:** Aplicar migration a la base de datos
- [ ] **PENDIENTE:** Probar flujo completo de registro y aprobación
- [ ] **PENDIENTE:** Verificar restricciones de acceso
- [ ] **PENDIENTE:** Validar experiencia de usuario

---

## Estado Actual
**Fase:** ✅ Implementación Completada - Pendiente de Testing
**Última actualización:** 2026-01-10

**Progreso:** 6/7 fases completadas (85.7%)

---

## Pasos para Aplicar los Cambios

### 1. Aplicar Migration a la Base de Datos
Ejecuta la migration en tu instancia de Supabase:
```bash
# Si usas Supabase CLI local
supabase db push

# O aplica manualmente en el Dashboard de Supabase
# SQL Editor -> Ejecutar el contenido de supabase/migrations/20260110000000_add_user_approval.sql
```

### 2. Verificar la Aplicación
Una vez aplicada la migration, los nuevos usuarios se registrarán con `approval_status = 'pending'` automáticamente.

### 3. Testing
- Registrar un nuevo usuario
- Verificar que aparece en estado "Pendiente" en el panel de admin
- Aprobar/rechazar usuarios desde el panel de admin
- Verificar que los usuarios pendientes ven la pantalla de espera
- Verificar que los usuarios rechazados ven la pantalla de rechazo
- Verificar que los usuarios aprobados pueden acceder normalmente

---

## Notas Técnicas

### Cambios en Base de Datos

#### Campo a agregar en `profiles`:
```sql
approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'))
```

**Estados:**
- `pending`: Usuario registrado, esperando aprobación
- `approved`: Usuario aprobado, puede usar la app
- `rejected`: Usuario rechazado por el admin

### Archivos Modificados/Creados

#### ✅ Base de Datos y Types:
- ✅ [supabase/migrations/20260110000000_add_user_approval.sql](supabase/migrations/20260110000000_add_user_approval.sql) - Migration creada
- ✅ [src/types/database.ts](src/types/database.ts) - Campo `approval_status` agregado

#### ✅ Services:
- ✅ [src/services/profileService.ts](src/services/profileService.ts) - Métodos `updateApprovalStatus`, `approveUser`, `rejectUser` agregados

#### ✅ Stores:
- ✅ [src/stores/profileStore.ts](src/stores/profileStore.ts) - Métodos de aprobación agregados con optimistic updates

#### ✅ Hooks:
- ✅ [src/features/auth/hooks/useProfile.ts](src/features/auth/hooks/useProfile.ts) - Estados `isApproved`, `isPending`, `isRejected` agregados
- ✅ [src/features/auth/components/AuthGuard.tsx](src/features/auth/components/AuthGuard.tsx) - Validación de `approval_status` implementada
- ✅ [src/hooks/admin/Users/useAdminUsersLogic.ts](src/hooks/admin/Users/useAdminUsersLogic.ts) - Filtros y métodos de aprobación agregados

#### ✅ UX/UI:
- ✅ [src/screens/client/PendingApproval/PendingApprovalPage.tsx](src/screens/client/PendingApproval/PendingApprovalPage.tsx) - Pantalla creada
- ✅ [src/screens/client/Rejected/RejectedPage.tsx](src/screens/client/Rejected/RejectedPage.tsx) - Pantalla creada
- ✅ [src/screens/admin/Users/UsersPage.tsx](src/screens/admin/Users/UsersPage.tsx) - Controles de aprobación agregados
- ✅ [src/app/router/index.tsx](src/app/router/index.tsx) - Rutas `/pending-approval` y `/rejected` agregadas

### Consideraciones de Seguridad
- RLS policies deben actualizarse para verificar `approval_status = 'approved'`
- Solo administradores pueden cambiar el estado de aprobación
- Usuarios no aprobados no deben poder acceder a datos sensibles
- Usuarios rechazados no deben poder iniciar sesión

### Funcionalidades Adicionales Implementadas

#### Auto-detección de cambios de estado
- Las páginas `/pending-approval` y `/rejected` verifican el estado cada 5 segundos
- Botón manual "Verificar Estado Ahora" para verificación inmediata
- Redirección automática cuando el admin cambia el estado del usuario

#### Manejo de usuarios eliminados
- Si un usuario es eliminado mientras tiene sesión activa:
  - Se detecta automáticamente el error `PGRST116` (perfil no encontrado)
  - Se cierra la sesión automáticamente
  - Se limpia el localStorage y el estado de la aplicación
  - Se redirige al login sin quedar en estado de carga infinita
- Funciona tanto en carga inicial como en refrescos de perfil

#### Control total de estados desde Admin
- Los administradores pueden cambiar el estado de cualquier usuario:
  - Pendientes: Aprobar o Rechazar
  - Rechazados: Aprobar o Poner en Pendiente
  - Aprobados: Rechazar o Poner en Pendiente
