# 🧪 Suite de Tests E2E - Calistenia Emérita

## Descripción General

Esta suite de tests end-to-end utiliza **Playwright** para validar todas las funcionalidades de la aplicación Calistenia Emérita. Los tests cubren tanto el panel de cliente como el panel de administrador.

---

## 📋 Estructura de la Suite de Tests

```
tests/
├── README.md                    # Este archivo
├── fixtures/
│   └── auth.fixtures.ts         # Fixtures reutilizables para autenticación
├── helpers/
│   └── test-helpers.ts          # Funciones auxiliares para tests
├── setup/                       # 🆕 Configuración y seeders para tests
│   ├── global-setup.ts          # Setup global de Playwright
│   ├── global-teardown.ts       # Teardown global de Playwright
│   ├── test-seeder.ts           # Seeder para crear datos de test
│   └── run-seeder.ts            # Script para ejecutar seeder manualmente
├── auth/
│   ├── login.spec.ts            # Tests de login
│   ├── logout.spec.ts           # Tests de logout
│   └── session.spec.ts          # Tests de persistencia de sesión
├── client/
│   ├── home.spec.ts             # Tests del dashboard de cliente
│   ├── booking.spec.ts          # Tests de reserva de clases
│   ├── my-bookings.spec.ts      # Tests de historial de reservas
│   ├── request-credits.spec.ts  # Tests de solicitud de créditos
│   ├── slots-visibility.spec.ts # 🆕 Tests de visibilidad de horarios
│   └── weight-stats.spec.ts     # Tests de estadísticas de peso
├── admin/
│   ├── dashboard.spec.ts        # Tests del dashboard admin
│   ├── users.spec.ts            # Tests de gestión de usuarios
│   ├── slots.spec.ts            # Tests de gestión de horarios
│   ├── bookings.spec.ts         # Tests de gestión de reservas
│   ├── payment-requests.spec.ts # Tests de solicitudes de pago
│   ├── pricing.spec.ts          # Tests de paquetes de precios
│   ├── payment-methods.spec.ts  # Tests de métodos de pago
│   └── settings.spec.ts         # Tests de configuración
└── landing/
    └── landing.spec.ts          # Tests de la landing page
```

---

## 🔐 Credenciales de Test

Las credenciales se cargan desde el archivo `.env.test`:

| Rol     | Variable          | Descripción             |
| ------- | ----------------- | ----------------------- |
| Admin   | `ADMIN_EMAIL`     | Email del administrador |
| Admin   | `ADMIN_PASSWORD`  | Contraseña del admin    |
| Cliente | `CLIENT_EMAIL`    | Email del cliente       |
| Cliente | `CLIENT_PASSWORD` | Contraseña del cliente  |

---

## 🚀 Ejecución de Tests

### Ejecutar todos los tests

```bash
pnpm run test
```

### Ejecutar tests en modo UI

```bash
pnpm run test:ui
```

### Ejecutar un archivo específico

```bash
pnpm run test tests/auth/login.spec.ts
```

### Ejecutar tests con debug

```bash
pnpm run test:debug
```

### Ver reporte de tests

```bash
pnpm run test:report
```

---

## 🌱 Sistema de Seeders para Tests

### ¿Por qué usamos seeders?

Los tests de funcionalidades como **visibilidad de horarios** dependen del día de la semana actual, lo que causa que los tests fallen de forma inconsistente. Para resolver esto, implementamos un **sistema de seeders** que crea datos predecibles.

### ¿Cómo funciona?

1. **Global Setup**: Antes de ejecutar cualquier test, el `global-setup.ts` ejecuta el seeder.
2. **Seeder**: El `test-seeder.ts` crea:
   - Un **horario recurrente** para el día de la semana correspondiente a 7 días después.
   - Un **horario específico** para exactamente 7 días después.
3. **Tests**: Los tests navegan a la **siguiente semana** donde siempre encontrarán los slots.
4. **Global Teardown**: Después de todos los tests, se limpian los datos de test.

### Datos de test creados

| Tipo       | ID (UUID)                              | Descripción                               |
| ---------- | -------------------------------------- | ----------------------------------------- |
| Recurrente | `00000000-0000-0000-0000-000000000001` | Slot de 10:00-11:00 para día de +7 días   |
| Específico | `00000000-0000-0000-0000-000000000002` | Slot de 12:00-13:00 para fecha de +7 días |

### Ejecutar seeder manualmente

```bash
pnpm run test:seed
```

### Configuración en `playwright.config.ts`

```typescript
export default defineConfig({
  // ...
  globalSetup: "./tests/setup/global-setup.ts",
  globalTeardown: "./tests/setup/global-teardown.ts",
  // ...
});
```

---

## 📊 Cobertura de Funcionalidades

### Épica 1: Autenticación (AUTH)

| ID      | Funcionalidad                    | Test File              | Estado |
| ------- | -------------------------------- | ---------------------- | ------ |
| AUTH-01 | Login con email y contraseña     | `auth/login.spec.ts`   | ✅     |
| AUTH-02 | Login como admin                 | `auth/login.spec.ts`   | ✅     |
| AUTH-03 | Login con credenciales inválidas | `auth/login.spec.ts`   | ✅     |
| AUTH-04 | Logout                           | `auth/logout.spec.ts`  | ✅     |
| AUTH-05 | Persistencia de sesión           | `auth/session.spec.ts` | ✅     |
| AUTH-06 | Redirección si no autenticado    | `auth/session.spec.ts` | ✅     |

### Épica 2: Reservas (BOOKING)

| ID      | Funcionalidad               | Test File                    | Estado |
| ------- | --------------------------- | ---------------------------- | ------ |
| BOOK-01 | Ver calendario de clases    | `client/booking.spec.ts`     | ✅     |
| BOOK-02 | Navegar entre semanas       | `client/booking.spec.ts`     | ✅     |
| BOOK-03 | Ver slots disponibles       | `client/booking.spec.ts`     | ✅     |
| BOOK-04 | Reservar una clase          | `client/booking.spec.ts`     | ✅     |
| BOOK-05 | Ver historial de reservas   | `client/my-bookings.spec.ts` | ✅     |
| BOOK-06 | Cancelar una reserva        | `client/my-bookings.spec.ts` | ✅     |
| BOOK-07 | Admin ve todas las reservas | `admin/bookings.spec.ts`     | ✅     |

### Épica 3: Créditos y Pagos (CREDITS)

| ID      | Funcionalidad                 | Test File                        | Estado |
| ------- | ----------------------------- | -------------------------------- | ------ |
| CRED-01 | Ver saldo de créditos         | `client/home.spec.ts`            | ✅     |
| CRED-02 | Solicitar paquete de créditos | `client/request-credits.spec.ts` | ✅     |
| CRED-03 | Seleccionar método de pago    | `client/request-credits.spec.ts` | ✅     |
| CRED-04 | Admin aprueba solicitud       | `admin/payment-requests.spec.ts` | ✅     |
| CRED-05 | Admin rechaza solicitud       | `admin/payment-requests.spec.ts` | ✅     |
| CRED-06 | Ver estado de solicitud       | `client/home.spec.ts`            | ✅     |

### Épica 4: Horarios (SCHEDULE)

| ID      | Funcionalidad              | Test File             | Estado |
| ------- | -------------------------- | --------------------- | ------ |
| SLOT-01 | Ver horarios configurados  | `admin/slots.spec.ts` | ✅     |
| SLOT-02 | Crear nuevo horario        | `admin/slots.spec.ts` | ✅     |
| SLOT-03 | Editar horario             | `admin/slots.spec.ts` | ✅     |
| SLOT-04 | Activar/desactivar horario | `admin/slots.spec.ts` | ✅     |
| SLOT-05 | Eliminar horario           | `admin/slots.spec.ts` | ✅     |

### Épica 5: Estadísticas (STATS)

| ID      | Funcionalidad            | Test File                     | Estado |
| ------- | ------------------------ | ----------------------------- | ------ |
| STAT-01 | Ver estadísticas de peso | `client/weight-stats.spec.ts` | ✅     |
| STAT-02 | Ver gráfico de progreso  | `client/weight-stats.spec.ts` | ✅     |

### Épica 6: Administración (ADMIN)

| ID     | Funcionalidad                  | Test File                       | Estado |
| ------ | ------------------------------ | ------------------------------- | ------ |
| ADM-01 | Ver dashboard admin            | `admin/dashboard.spec.ts`       | ✅     |
| ADM-02 | Ver métricas del dashboard     | `admin/dashboard.spec.ts`       | ✅     |
| ADM-03 | Gestionar usuarios             | `admin/users.spec.ts`           | ✅     |
| ADM-04 | Ver detalle de usuario         | `admin/users.spec.ts`           | ✅     |
| ADM-05 | Configurar paquetes de precios | `admin/pricing.spec.ts`         | ✅     |
| ADM-06 | Configurar métodos de pago     | `admin/payment-methods.spec.ts` | ✅     |
| ADM-07 | Configuración general          | `admin/settings.spec.ts`        | ✅     |

### Épica 7: Landing Page (LANDING)

| ID      | Funcionalidad               | Test File                 | Estado |
| ------- | --------------------------- | ------------------------- | ------ |
| LAND-01 | Cargar landing page         | `landing/landing.spec.ts` | ✅     |
| LAND-02 | Ver secciones de la landing | `landing/landing.spec.ts` | ✅     |
| LAND-03 | Navegación a login          | `landing/landing.spec.ts` | ✅     |

---

## 🔧 Fixtures y Helpers

### Fixture: `authenticatedClient`

Proporciona una página autenticada como cliente.

### Fixture: `authenticatedAdmin`

Proporciona una página autenticada como administrador.

### Helper: `loginAsClient(page)`

Inicia sesión como cliente.

### Helper: `loginAsAdmin(page)`

Inicia sesión como administrador.

### Helper: `logout(page)`

Cierra la sesión actual.

### Helper: `waitForPageLoad(page)`

Espera a que la página cargue completamente.

---

## 📝 Notas Importantes

1. **Servidor de desarrollo**: Asegúrate de que el servidor de desarrollo esté corriendo en `http://localhost:5173` antes de ejecutar los tests.

2. **Base de datos**: Los tests utilizan la base de datos de producción/desarrollo. Ten cuidado con los datos de prueba.

3. **Orden de ejecución**: Algunos tests dependen del estado de la aplicación (ej. créditos disponibles).

4. **Tiempos de espera**: Los tests usan timeouts generosos para manejar cargas de datos lentas.

---

## 🐛 Debugging

### Ver trace de errores

```bash
npx playwright show-trace test-results/*/trace.zip
```

### Ejecutar en modo headed

```bash
pnpm run test -- --headed
```

### Pausar en un test

```typescript
await page.pause();
```

---

## 📈 Métricas de Tests

| Métrica       | Valor Objetivo |
| ------------- | -------------- |
| Cobertura     | > 90%          |
| Tiempo total  | < 5 min        |
| Tests pasando | 100%           |
| Flaky tests   | 0%             |

---

_Última actualización: Enero 2026_
