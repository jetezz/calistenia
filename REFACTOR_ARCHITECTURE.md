# Propuesta de Nueva Arquitectura del Proyecto

Este documento describe la nueva estructura de directorios y el flujo de datos para la refactorización de la aplicación.

## 1. Estructura de Directorios

La organización principal se basará en "Screens" (Pantallas), separando claramente el entorno de Cliente del de Admin.

```text
src/
├── screens/
│   ├── client/
│   │   ├── [NombreVista]/
│   │   │   ├── components/       # Componentes exclusivos de esta vista
│   │   │   └── [NombreVista]Page.tsx
│   │   └── ...
│   │
│   └── admin/
│       ├── [NombreVista]/
│       │   ├── components/
│       │   └── [NombreVista]Page.tsx
│       └── ...
│
├── hooks/
│   ├── client/
│   │   ├── [NombreVista]/
│   │   │   └── use[NombreVista]Logic.ts  # Orquestador del estado para la vista
│   │   └── ...
│   │
│   └── admin/
│       ├── [NombreVista]/
│       │   └── use[NombreVista]Logic.ts
│       └── ...
│
├── components/                   # Componentes Globales Reutilizables
│
├── stores/                       # Gestión de Estado (1 por Entidad de BD)
│   ├── BaseStore.ts              # Heredable con CRUD + Optimistic Update
│   ├── BookingStore.ts           # Hereda de BaseStore
│   ├── ProfileStore.ts
│   ├── PaymentRequestStore.ts
│   └── ...
│
└── services/                     # Comunicación con API (1 por Entidad de BD)
    ├── BookingService.ts
    ├── ProfileService.ts
    └── ...
```

## 2. Flujo de Datos y Reglas

El flujo de dependencia es estricto:

`UX (Screens/Components)` **→** `Hooks` **→** `Stores` **→** `Services`

### Definición de Responsabilidades

1.  **UX (Screens & Components)**:

    - **Responsabilidad**: Solo renderizado visual.
    - **Restricción**: Solo usan **Hooks**.
    - **Prohibido**: Acceder a `Stores` o `Services`.

2.  **Hooks (Lógica de Vista)**:

    - **Responsabilidad**: Agrupar la lógica de una vista específica.
    - **Función**: Llaman a múltiples **Stores** para componer los datos que necesita la pantalla.
    - **Ejemplo**: `useAdminDashboardLogic` puede llamar a `useBookingStore`, `useProfileStore` y `usePaymentRequestStore`.

3.  **Stores (Estado de Entidad)**:

    - **Responsabilidad**: Gestión del estado de una **tabla/modelo** específico.
    - **Estructura**: `BaseStore<Entity>` (CRUD genérico) + Acciones extra específicas de esa entidad.
    - **Correspondencia**: 1 Store = 1 Tabla de Base de Datos.

4.  **Services (API de Entidad)**:
    - **Responsabilidad**: Comunicación HTTP/Supabase para una tabla específica.
    - **Correspondencia**: 1 Service = 1 Tabla de Base de Datos.

## 3. Detalle Técnico: BaseStore

(Se mantiene igual que la versión anterior, implementando `createBaseStore` con genéricos estricto).

## 4. Plan de Migración y Estado Actual

El objetivo es migrar todas las vistas de Admin a la nueva arquitectura.

- [x] **Fase 1-4: Admin Dashboard** (Completado)
- [x] **Fase 5: Entidades Faltantes** (Completado)
- [x] **Fase 6: Vista Reservas** (Completado)
- [x] **Fase 7: Vista Solicitudes de Pago** (Completado)
- [x] **Fase 8: Vista Usuarios** (Completado)
- [x] **Fase 9: Vista Horarios** (Completado)
- [x] **Fase 10: Vistas Pricing & Payment Methods** (Completado)
- [x] **Fase 11: Vista Configuración General (Settings)** (Completado)

### Tareas Finales Admin

- [x] Limpieza de código deprecado (`useAdminData`, viejas vistas).
- [x] Actualización de Header para eliminar dependencias viejas.

El refactor de la parte de Admin está **COMPLETO**.
Siguientes pasos sugeridos: Refactor de Vistas de Cliente.
