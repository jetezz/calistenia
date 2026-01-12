# Alerta de Usuarios Pendientes en Dashboard Admin

## Descripción

Se ha implementado una funcionalidad para mostrar una alerta en el panel de administración (`/app/admin`) cuando hay usuarios en estado "pending" (pendiente) que requieren validación o rechazo.

## Cambios Realizados

### 1. Hook `useDashboardLogic.ts`

**Archivo**: `src/hooks/admin/Dashboard/useDashboardLogic.ts`

Se agregó el cálculo de `pendingUsersCount` en las estadísticas del dashboard:

```typescript
pendingUsersCount: profiles.filter(
  (p) => (p.role === "user" || !p.role) && p.approval_status === "pending"
).length,
```

Este contador filtra todos los perfiles que:

- Tienen rol de "user" o no tienen rol definido
- Tienen `approval_status === "pending"`

### 2. Componente `DashboardPage.tsx`

**Archivo**: `src/screens/admin/Dashboard/DashboardPage.tsx`

Se realizaron dos cambios principales:

#### a) Tarjeta de Usuarios con Highlight

La tarjeta de "Usuarios" ahora se destaca visualmente cuando hay usuarios pendientes:

```typescript
{
  title: "Usuarios",
  value: stats.totalUsersCount,
  description: "Clientes",
  icon: Users,
  gradient: "from-green-500 to-emerald-500",
  iconBg: "bg-green-500/10",
  iconColor: "text-green-600",
  href: "/app/admin/users",
  highlight: stats.pendingUsersCount > 0, // ← Nuevo
}
```

#### b) Nueva Alerta de Usuarios Pendientes

Se agregó una alerta específica que aparece en la sección "Atención Requerida":

```typescript
if (stats.pendingUsersCount > 0) {
  alerts.push({
    type: "pending-users",
    title: `${stats.pendingUsersCount} usuario${
      stats.pendingUsersCount > 1 ? "s" : ""
    } pendiente${stats.pendingUsersCount > 1 ? "s" : ""}`,
    description: "Requieren validación",
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    href: "/app/admin/users",
    badge: stats.pendingUsersCount,
  });
}
```

## Comportamiento

### Cuando hay usuarios pendientes:

1. **Tarjeta de Usuarios**: Se muestra con un anillo de color primario y un badge "Nuevo" animado
2. **Sección de Alertas**: Aparece una alerta con:
   - Título: "X usuario(s) pendiente(s)"
   - Descripción: "Requieren validación"
   - Badge con el número de usuarios pendientes
   - Color ámbar para indicar acción requerida
   - Al hacer clic, redirige a `/app/admin/users`

### Cuando NO hay usuarios pendientes:

- La tarjeta de usuarios se muestra normalmente sin highlight
- No aparece la alerta en la sección "Atención Requerida"

## Prioridad de Alertas

Las alertas se muestran en el siguiente orden:

1. Nuevas reservas (azul)
2. **Usuarios pendientes (ámbar)** ← Nueva
3. Solicitudes de pago pendientes (naranja)
4. Sin horarios activos (rojo)

## Diseño Visual

- **Color**: Ámbar (`amber-600`, `amber-50`, `amber-200`)
- **Icono**: Users (lucide-react)
- **Estilo**: Consistente con las demás alertas del dashboard
- **Interacción**: Hover effect y animación al hacer clic

## Integración con Página de Usuarios

Al hacer clic en la alerta, el usuario es redirigido a `/app/admin/users` donde ya existe la funcionalidad para:

- Ver usuarios filtrados por estado (pendientes, aprobados, rechazados)
- Aprobar o rechazar usuarios
- Ver detalles de cada usuario

## Notas Técnicas

- La alerta se actualiza automáticamente cuando se refresca el dashboard
- El contador incluye solo usuarios con rol "user" o sin rol definido
- Los usuarios admin no se cuentan en el `pendingUsersCount`
