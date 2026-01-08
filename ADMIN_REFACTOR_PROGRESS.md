# Progreso de Refactorización - Admin Data Optimization

## ✅ Completado

### 1. Infraestructura Base

- ✅ Funciones RPC en Supabase (`get_admin_dashboard_data`, `get_admin_secondary_data`)
- ✅ Service: `adminDataService.ts`
- ✅ Store: `adminDataStore.ts`
- ✅ Hook: `useAdminData.ts`
- ✅ Tipos TypeScript actualizados

### 2. Páginas Refactorizadas

- ✅ **AdminDashboardPage** - Usa `useAdminData`
- ✅ **AdminBookingsPage** - Usa `useAdminData` + `useBookingStore` para CRUD

## 📋 Pendientes de Refactorizar

### Páginas de Admin que AÚN usan hooks antiguos:

#### 3. AdminPaymentRequestsPage

**Hooks actuales:**

- `usePaymentRequest()` - Para listar y actualizar
- `useProfile()` (de @/hooks) - Para updateCredits

**Refactorización necesaria:**

```typescript
// ANTES
const { paymentRequests, loading, fetchPaymentRequests, updatePaymentRequest } =
  usePaymentRequest();

// DESPUÉS
const {
  pendingPaymentRequests,
  allPaymentRequests,
  isDashboardLoading,
  refresh,
} = useAdminData();
const { updatePaymentRequest } = usePaymentRequestStore();
const { updateCredits } = useProfileStore();
```

#### 4. AdminUsersPage

**Hooks actuales:**

- Probablemente usa `useProfile()` de @/hooks

**Refactorización necesaria:**

```typescript
// DESPUÉS
const { profiles, isDashboardLoading, refresh } = useAdminData();
```

#### 5. AdminPricingPage

**Estado:** Ya refactorizado parcialmente

- Usa `usePricingPackage(true)`
- **Verificar** si puede usar `useAdminData`

**Refactorización necesaria:**

```typescript
// DESPUÉS
const { pricingPackages, isSecondaryLoading, refresh } = useAdminData();
const { createPackage, updatePackage, deletePackage } =
  usePricingPackageStore();
```

#### 6. AdminPaymentMethodsPage

**Estado:** Ya refactorizado parcialmente

- Usa `usePaymentMethod(true)`
- **Verificar** si puede usar `useAdminData`

**Refactorización necesaria:**

```typescript
// DESPUÉS
const { paymentMethods, isSecondaryLoading, refresh } = useAdminData();
const { createMethod, updateMethod, deleteMethod } = usePaymentMethodStore();
```

#### 7. AdminSlotsPage / EnhancedAdminSlotsPage

**Hooks actuales:**

- `useTimeSlot()`

**Refactorización necesaria:**

```typescript
// DESPUÉS
const { activeTimeSlots, allTimeSlots, isSecondaryLoading, refresh } =
  useAdminData();
const { createTimeSlot, updateTimeSlot, deleteTimeSlot } = useTimeSlotStore();
```

#### 8. AdminUserDetailPage

**Hooks actuales:**

- `useProfile()`
- `useBooking()`

**Refactorización necesaria:**

```typescript
// DESPUÉS
const { profiles, bookings, isDashboardLoading } = useAdminData();
// Filtrar por ID en el componente
```

## 🎯 Resultado Esperado

### Antes (Estado Actual)

- **~20 llamadas API** al cargar /admin
  - 10x profiles
  - 2x bookings
  - 2x payment_requests
  - 2x time_slots
  - 4x RPC (dashboard + secondary, duplicadas por StrictMode)

### Después (Objetivo)

- **4-6 llamadas API** al cargar /admin
  - 2x RPC dashboard (duplicadas por StrictMode)
  - 2x RPC secondary (duplicadas por StrictMode)
  - 1-2x profiles (Header/Auth - necesarias)

**Reducción: ~70-80%** en llamadas API

## 📝 Patrón de Refactorización

Para cada página de admin:

1. **Importar useAdminData** en lugar de hooks individuales
2. **Obtener datos del store central**
3. **Importar stores individuales** solo para operaciones CRUD
4. **Llamar a refresh()** después de operaciones CRUD
5. **Eliminar useEffect** que hacía fetch inicial
6. **Actualizar botones de refresh** para usar `refresh()` de useAdminData

### Ejemplo Completo:

```typescript
// ANTES
import { useEffect } from "react";
import { useBooking } from "@/hooks";

export function AdminBookingsPage() {
  const { bookings, loading, fetchBookings, updateBooking } = useBooking();

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdate = async (id, data) => {
    await updateBooking(id, data);
    await fetchBookings(); // Reload
  };

  return (
    <div>
      <Button onClick={fetchBookings}>Refresh</Button>
      {/* ... */}
    </div>
  );
}

// DESPUÉS
import { useAdminData } from "@/hooks";
import { useBookingStore } from "@/stores";

export function AdminBookingsPage() {
  const { bookings, isDashboardLoading: loading, refresh } = useAdminData();
  const { updateBooking } = useBookingStore();

  const handleUpdate = async (id, data) => {
    await updateBooking(id, data);
    await refresh(); // Reload ALL admin data
  };

  return (
    <div>
      <Button onClick={refresh}>Refresh</Button>
      {/* ... */}
    </div>
  );
}
```

## 🔄 Próximos Pasos

1. Refactorizar AdminPaymentRequestsPage
2. Refactorizar AdminUsersPage
3. Verificar y ajustar AdminPricingPage
4. Verificar y ajustar AdminPaymentMethodsPage
5. Refactorizar AdminSlotsPage
6. Refactorizar AdminUserDetailPage
7. **Probar en navegador** y verificar reducción de llamadas
8. **Eliminar hooks deprecated** que ya no se usan

## ⚠️ Notas Importantes

- **NO eliminar** `useProfile` de `@/features/auth` - es necesario para autenticación
- **Header y MobileNav** seguirán usando `useProfile` de auth - esto es correcto
- Los hooks de `@/hooks` (useProfile, useBooking, etc.) pueden mantenerse para vistas de cliente
- Solo las páginas de **admin** deben usar `useAdminData`

## 📊 Métricas de Éxito

- [ ] Reducción de llamadas API de ~20 a ~6
- [ ] Tiempo de carga del dashboard < 1s
- [ ] No hay llamadas duplicadas a la misma tabla
- [ ] Todas las páginas de admin funcionan correctamente
- [ ] Las operaciones CRUD actualizan el store central
