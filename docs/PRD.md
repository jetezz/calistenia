# 📋 Product Requirements Document (PRD)

## Calistenia Emérita - Sistema de Gestión de Clases

**Versión**: 1.0  
**Fecha**: 18 de Enero de 2026  
**Autor**: Jetezz  
**Estado**: En Producción

---

## 📑 Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Objetivos del Producto](#2-objetivos-del-producto)
3. [Público Objetivo](#3-público-objetivo)
4. [Análisis de Mercado](#4-análisis-de-mercado)
5. [Requisitos Funcionales](#5-requisitos-funcionales)
6. [Requisitos No Funcionales](#6-requisitos-no-funcionales)
7. [Arquitectura Técnica](#7-arquitectura-técnica)
8. [Modelo de Datos](#8-modelo-de-datos)
9. [User Flows](#9-user-flows)
10. [Métricas de Éxito](#10-métricas-de-éxito)
11. [Roadmap](#11-roadmap)
12. [Riesgos y Mitigaciones](#12-riesgos-y-mitigaciones)

---

## 1. Resumen Ejecutivo

### 1.1 Visión del Producto

**Calistenia Emérita** es una aplicación web y móvil diseñada para **democratizar el acceso a una vida activa** a través de la calistenia. La plataforma conecta a usuarios con un sistema intuitivo de reservas de clases, gestión de créditos virtuales y seguimiento de progreso físico.

### 1.2 Problema que Resuelve

| Problema                                            | Solución                                                  |
| --------------------------------------------------- | --------------------------------------------------------- |
| Dificultad para mantener constancia en el ejercicio | Sistema de citas/reservas que genera compromiso externo   |
| Gestión manual de reservas (WhatsApp, llamadas)     | Automatización completa del proceso de reservas           |
| Falta de seguimiento de progreso                    | Dashboard con estadísticas de peso y composición corporal |
| Pagos no estructurados                              | Sistema de créditos virtuales con aprobación de admin     |
| Información dispersa sobre horarios                 | Calendario centralizado con disponibilidad en tiempo real |

### 1.3 Propuesta de Valor

> **"Tu compromiso con tu salud, simplificado."**

- ✅ Reserva tu clase en 3 clics
- ✅ Seguimiento visual de tu progreso
- ✅ Créditos virtuales sin fricción
- ✅ Notificaciones automáticas
- ✅ Acceso desde cualquier dispositivo

---

## 2. Objetivos del Producto

### 2.1 Objetivos de Negocio

| ID  | Objetivo                       | Métrica                         | Target    |
| --- | ------------------------------ | ------------------------------- | --------- |
| O1  | Aumentar retención de clientes | Churn rate mensual              | < 10%     |
| O2  | Reducir no-shows en clases     | Tasa de cancelaciones tardías   | < 5%      |
| O3  | Automatizar operaciones        | Tiempo de gestión manual/semana | < 2 horas |
| O4  | Escalar sin fricción operativa | Usuarios activos soportados     | 500+      |

### 2.2 Objetivos de Usuario

| Rol         | Objetivo Principal         | Jobs to be Done                                     |
| ----------- | -------------------------- | --------------------------------------------------- |
| **Cliente** | Reservar clases fácilmente | Encontrar horario → Reservar → Recibir confirmación |
| **Cliente** | Seguir mi progreso         | Ver histórico → Comparar métricas → Motivarse       |
| **Admin**   | Gestionar el negocio       | Ver reservas → Aprobar pagos → Configurar horarios  |

### 2.3 Indicadores Clave (KPIs)

```
┌────────────────────────────────────────────────────────┐
│                    KPIs Principales                    │
├────────────────────┬───────────────────────────────────┤
│ Usuarios Activos   │ Usuarios con ≥1 reserva/mes       │
│ Tasa de Ocupación  │ Reservas / Capacidad Total        │
│ LTV (Lifetime Val) │ Créditos comprados × Precio       │
│ NPS                │ Encuesta de satisfacción          │
│ Time to Book       │ Tiempo promedio reserva           │
└────────────────────┴───────────────────────────────────┘
```

---

## 3. Público Objetivo

### 3.1 Buyer Persona Principal: "Miguel Ángel"

```
┌─────────────────────────────────────────────────────────┐
│           👤 MIGUEL ÁNGEL - Buyer Persona               │
├─────────────────────────────────────────────────────────┤
│ Demografía                                              │
│ • Edad: 40-50 años                                      │
│ • Ubicación: Mérida, Extremadura                        │
│ • Ocupación: Profesional / Autónomo                     │
│ • Familia: Casado, con hijos                            │
├─────────────────────────────────────────────────────────┤
│ Comportamiento                                          │
│ • No es nativo digital (usa WhatsApp, poco más)         │
│ • Prefiere botones grandes y texto claro                │
│ • Valora la simplicidad sobre las funcionalidades       │
│ • Necesita confirmaciones claras de sus acciones        │
├─────────────────────────────────────────────────────────┤
│ Motivaciones                                            │
│ • Salud sobre estética (prevención de lesiones)         │
│ • Mantener un estilo de vida activo                     │
│ • Busca compromiso externo para mantener constancia     │
├─────────────────────────────────────────────────────────┤
│ Frustraciones                                           │
│ • Apps complicadas con muchos pasos                     │
│ • Gestión de reservas por WhatsApp (olvidadizo)         │
│ • No saber si hay hueco disponible                      │
│ • Perder track de su progreso                           │
├─────────────────────────────────────────────────────────┤
│ Quote                                                   │
│ "Solo quiero saber si hay hueco y reservar, sin líos"   │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Usuarios Secundarios

| Persona                  | Características                    | Necesidades                         |
| ------------------------ | ---------------------------------- | ----------------------------------- |
| **Joven Activo (25-35)** | Nativo digital, busca optimización | Rapidez, integración con calendario |
| **Senior (55+)**         | Baja fluidez digital               | Máxima simplicidad, texto grande    |
| **Administrador**        | Dueño/entrenador del negocio       | Control total, métricas, eficiencia |

### 3.3 Principios de Diseño UX

| Principio                 | Implementación                                 |
| ------------------------- | ---------------------------------------------- |
| **Mobile First**          | Diseño responsive, optimizado para smartphones |
| **Simplicidad Extrema**   | Botones grandes, texto claro, alto contraste   |
| **Accesibilidad**         | WCAG 2.1 AA, fuentes legibles (≥16px)          |
| **Feedback Inmediato**    | Toast notifications, estados de loading        |
| **Prevención de Errores** | Confirmaciones, estados disabled claros        |

---

## 4. Análisis de Mercado

### 4.1 Competencia Directa

| Competidor           | Fortalezas                | Debilidades                            | Nuestra Ventaja     |
| -------------------- | ------------------------- | -------------------------------------- | ------------------- |
| **Mindbody**         | Funcionalidades completas | Complejo, caro, overkill para pequeños | Simplicidad, precio |
| **Calendly**         | Fácil de usar             | No específico fitness, sin créditos    | Especialización     |
| **WhatsApp**         | Ubicuo, gratis            | Manual, sin tracking, caótico          | Automatización      |
| **Hojas de cálculo** | Flexible                  | Manual, propenso a errores             | Tiempo real         |

### 4.2 Diferenciadores Clave

1. **Diseño para no nativos digitales**: Interfaz extremadamente simple
2. **Sistema de créditos virtuales**: Sin pasarela de pago online (mayor confianza)
3. **Especialización en calistenia**: Terminología y flujos específicos
4. **Bajo costo operativo**: Sin fees por transacción (pagos offline)
5. **Tracking de composición corporal**: Valor añadido de progreso

---

## 5. Requisitos Funcionales

### 5.1 Épicas del Producto

```
┌────────────────────────────────────────────────────────────────┐
│                        ÉPICAS PRINCIPALES                       │
├────────────────┬───────────────────────────────────────────────┤
│ E1. AUTH       │ Sistema de autenticación y gestión de cuentas │
│ E2. BOOKING    │ Reserva y gestión de clases                   │
│ E3. CREDITS    │ Sistema de créditos virtuales y pagos         │
│ E4. SCHEDULE   │ Configuración de horarios y capacidad         │
│ E5. STATS      │ Estadísticas de peso y composición corporal   │
│ E6. ADMIN      │ Panel de gestión, configuración y branding    │
│ E7. LANDING    │ Página de marketing autogestionable           │
└────────────────┴───────────────────────────────────────────────┘
```

### 5.2 User Stories por Épica

#### E1. Autenticación (AUTH)

| ID     | User Story                                                          | Criterios de Aceptación                         | Prioridad   |
| ------ | ------------------------------------------------------------------- | ----------------------------------------------- | ----------- |
| US-1.1 | Como usuario, quiero registrarme con mi email para crear una cuenta | Email válido, contraseña ≥8 chars, confirmación | Must Have   |
| US-1.2 | Como usuario, quiero iniciar sesión con Google para acceder rápido  | OAuth 2.0, creación automática de perfil        | Should Have |
| US-1.3 | Como usuario, quiero restablecer mi contraseña si la olvido         | Email de recuperación, link temporal            | Must Have   |
| US-1.4 | Como usuario, quiero mantener mi sesión activa                      | Refresh tokens, 30 días de persistencia         | Must Have   |
| US-1.5 | Como nuevo usuario, quiero pasar por un proceso de aprobación       | Estado pendiente → aprobado (admin)             | Must Have   |

#### E2. Reservas (BOOKING)

| ID     | User Story                                                       | Criterios de Aceptación                                    | Prioridad   |
| ------ | ---------------------------------------------------------------- | ---------------------------------------------------------- | ----------- |
| US-2.1 | Como cliente, quiero ver los horarios disponibles de la semana   | Calendario visual, slots con disponibilidad                | Must Have   |
| US-2.2 | Como cliente, quiero reservar una clase en un horario disponible | Deducción de 1 crédito, confirmación inmediata             | Must Have   |
| US-2.3 | Como cliente, quiero cancelar mi reserva y recuperar mi crédito  | Confirmación, reembolso automático de crédito              | Must Have   |
| US-2.4 | Como cliente, quiero ver mi historial de reservas                | Lista paginada, filtros por estado                         | Should Have |
| US-2.5 | Como admin, quiero crear reservas para clientes (cortesía)       | Sin deducción de créditos, marcado como "creado por admin" | Must Have   |
| US-2.6 | Como admin, quiero ver todas las reservas del día                | Vista resumen, capacidad ocupada                           | Must Have   |

#### E3. Créditos y Pagos (CREDITS)

| ID     | User Story                                            | Criterios de Aceptación                     | Prioridad   |
| ------ | ----------------------------------------------------- | ------------------------------------------- | ----------- |
| US-3.1 | Como cliente, quiero ver mi saldo de créditos         | Número prominente en dashboard              | Must Have   |
| US-3.2 | Como cliente, quiero solicitar un paquete de créditos | Selección de paquete, método de pago        | Must Have   |
| US-3.3 | Como cliente, quiero ver el estado de mi solicitud    | Estados: pendiente, aprobado, rechazado     | Must Have   |
| US-3.4 | Como admin, quiero aprobar solicitudes de créditos    | Lista de pendientes, añadir automáticamente | Must Have   |
| US-3.5 | Como admin, quiero rechazar solicitudes con motivo    | Campo de notas, notificación al usuario     | Should Have |
| US-3.6 | Como admin, quiero configurar paquetes de precios     | CRUD de paquetes, orden de display          | Must Have   |
| US-3.7 | Como admin, quiero configurar métodos de pago         | Bizum, PayPal, transferencia, efectivo      | Must Have   |

#### E4. Horarios (SCHEDULE)

| ID     | User Story                                                  | Criterios de Aceptación                | Prioridad   |
| ------ | ----------------------------------------------------------- | -------------------------------------- | ----------- |
| US-4.1 | Como admin, quiero crear horarios semanales recurrentes     | Día, hora inicio/fin, capacidad        | Must Have   |
| US-4.2 | Como admin, quiero crear clases especiales (one-time)       | Fecha específica, no recurrente        | Should Have |
| US-4.3 | Como admin, quiero desactivar horarios sin borrar histórico | Soft delete, mantiene reservas pasadas | Must Have   |
| US-4.4 | Como admin, quiero modificar la capacidad de un horario     | Validación vs reservas existentes      | Should Have |

#### E5. Estadísticas (STATS)

| ID     | User Story                                                | Criterios de Aceptación            | Prioridad   |
| ------ | --------------------------------------------------------- | ---------------------------------- | ----------- |
| US-5.1 | Como cliente, quiero ver mi progreso de peso en gráfico   | Chart temporal, tendencia          | Should Have |
| US-5.2 | Como cliente, quiero registrar mi composición corporal    | Peso, % grasa, masa muscular, etc. | Should Have |
| US-5.3 | Como admin, quiero registrar mediciones de un cliente     | Formulario completo, fecha         | Should Have |
| US-5.4 | Como admin, quiero ver estadísticas de todos los usuarios | Dashboard consolidado              | Could Have  |

#### E6. Administración (ADMIN)

| US-6.1 | Como admin, quiero ver un dashboard con métricas clave | Reservas hoy, créditos pendientes, ocupación | Must Have |
| US-6.2 | Como admin, quiero gestionar perfiles de usuarios | Editar, aprobar, añadir créditos | Must Have |
| US-6.3 | Como admin, quiero configurar políticas de cancelación | Horas antes permitidas, penalización | Should Have |
| US-6.4 | Como admin, quiero configurar la confirmación automática| Toggle auto-confirm vs manual | Must Have |
| US-6.5 | Como admin, quiero personalizar el menú de la app | Seleccionar 4 acciones rápidas | Should Have |
| US-6.6 | Como admin, quiero ver reportes de ingresos | Filtros temporales, exportación | Could Have |

#### E7. Landing Page (LANDING)

| ID     | User Story                                         | Criterios de Aceptación              | Prioridad   |
| ------ | -------------------------------------------------- | ------------------------------------ | ----------- |
| US-7.1 | Como visitante, quiero ver información del negocio | Hero, servicios, ubicación, contacto | Must Have   |
| US-7.2 | Como admin, quiero personalizar la landing page    | Textos, imágenes, colores            | Should Have |
| US-7.3 | Como visitante, quiero ver testimonios de clientes | Carrusel, nombres y fotos            | Could Have  |

---

## 6. Requisitos No Funcionales

### 6.1 Rendimiento

| Requisito                          | Especificación    | Medición           |
| ---------------------------------- | ----------------- | ------------------ |
| **Tiempo de carga inicial**        | < 3 segundos (3G) | Lighthouse         |
| **Time to Interactive (TTI)**      | < 5 segundos      | Web Vitals         |
| **Largest Contentful Paint (LCP)** | < 2.5 segundos    | Core Web Vitals    |
| **First Input Delay (FID)**        | < 100ms           | Core Web Vitals    |
| **API Response Time**              | < 500ms (p95)     | Supabase dashboard |

### 6.2 Escalabilidad

| Requisito                 | Especificación         |
| ------------------------- | ---------------------- |
| **Usuarios concurrentes** | 100+ simultáneos       |
| **Usuarios totales**      | 10,000+ registrados    |
| **Reservas/día**          | 500+ procesadas        |
| **Almacenamiento**        | Escalable con Supabase |

### 6.3 Disponibilidad

| Requisito                          | Especificación                            |
| ---------------------------------- | ----------------------------------------- |
| **Uptime**                         | 99.9% (excluye mantenimiento planificado) |
| **RPO (Recovery Point Objective)** | 1 hora                                    |
| **RTO (Recovery Time Objective)**  | 4 horas                                   |

### 6.4 Seguridad

| Requisito                 | Implementación                          |
| ------------------------- | --------------------------------------- |
| **Autenticación**         | JWT, OAuth 2.0, MFA opcional            |
| **Autorización**          | Row Level Security (PostgreSQL)         |
| **Datos en tránsito**     | HTTPS obligatorio (TLS 1.3)             |
| **Datos en reposo**       | Encriptación AES-256 (Supabase)         |
| **Prevención de ataques** | CSRF tokens, rate limiting              |
| **GDPR Compliance**       | Derecho al olvido, exportación de datos |

### 6.5 Compatibilidad

| Plataforma        | Requisitos Mínimos                            |
| ----------------- | --------------------------------------------- |
| **Web - Desktop** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Web - Mobile**  | Chrome Android 90+, Safari iOS 14+            |
| **Android App**   | Android 8.0+ (API 26)                         |
| **iOS App**       | iOS 14+ (futuro)                              |

### 6.6 Accesibilidad

| Estándar                   | Nivel                                   |
| -------------------------- | --------------------------------------- |
| **WCAG**                   | 2.1 AA                                  |
| **Contraste**              | ≥ 4.5:1 texto, ≥ 3:1 elementos gráficos |
| **Navegación por teclado** | Completa                                |
| **Screen readers**         | Compatible (ARIA)                       |

---

## 7. Arquitectura Técnica

### 7.1 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React 19)                        │
├─────────────────────────────────────────────────────────────────┤
│ • React 19.2 + TypeScript 5.9                                   │
│ • Vite 7.2 (Rolldown bundler)                                   │
│ • Tailwind CSS 4.1 + shadcn/ui                                  │
│ • Zustand 5.0 (State management)                                │
│ • React Router 7.x                                              │
│ • Framer Motion 12.25 (Animaciones)                             │
│ • Lucide React (Iconografía)                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls (REST + Realtime)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Supabase BaaS)                     │
├─────────────────────────────────────────────────────────────────┤
│ • PostgreSQL 15 (Database)                                      │
│ • Row Level Security (RLS)                                      │
│ • Supabase Auth (JWT + OAuth)                                   │
│ • Supabase Realtime (WebSockets)                                │
│ • Edge Functions (Deno) - futuro                                │
│ • Storage (futuro)                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Deployment
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE                             │
├─────────────────────────────────────────────────────────────────┤
│ • Vercel (Web hosting + CDN)                                    │
│ • Capacitor 8.0 (Android/iOS)                                   │
│ • GitHub Actions (CI/CD)                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Arquitectura en Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                     UX Layer (React)                            │
│                   Screens & Components                          │
│              Pure presentation & user interaction               │
└────────────────────────┬────────────────────────────────────────┘
                         │ Only uses Hooks
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                           │
│                   Custom Hooks                                  │
│         Orchestrates business rules & data flow                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ Calls Stores
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                   │
│              Stores (Zustand) + Services                        │
│        State management + database operations                   │
└────────────────────────┬────────────────────────────────────────┘
                         │ API Calls
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Database (Supabase)                            │
│            PostgreSQL + Row Level Security                      │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Flujo de Datos

```
User Action → Component → Hook → Store → Service → Database
     ↓           ↓         ↓       ↓        ↓         ↓
UI Event → Event Handler → Business → State → DB Call → Response
     ↓           ↓         ↓       ↓        ↓         ↓
  Result ← UI Update ← Hook Resp ← Store ← Service ← DB Data
```

---

## 8. Modelo de Datos

### 8.1 Diagrama Entidad-Relación

```
                  ┌──────────────────┐
                  │   auth.users     │
                  │   (Supabase)     │
                  └────────┬─────────┘
                           │
                           │ (1:1)
                           ↓
        ┌──────────────────────────────────────┐
        │           profiles                   │
        │  • id (PK, FK → auth.users)         │
        │  • email, full_name, phone          │
        │  • role, credits, approval_status   │
        │  • birth_date, gender, height       │
        └──┬──────────────┬────────────────┬──┘
           │              │                │
           │ (1:N)        │ (1:N)          │ (1:N)
           ↓              ↓                ↓
  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐
  │   bookings     │  │ weight_stats │  │ payment_requests │
  │  • user_id (FK)│  │ • user_id    │  │ • user_id (FK)   │
  │  • created_by  │  │ • weight     │  │ • credits_req    │
  └────────┬───────┘  │ • body_fat   │  │ • status         │
           │          └──────────────┘  └────────┬─────────┘
           │ (N:1)                               │
           ↓                                     │ (N:1)
  ┌────────────────┐                    ┌─────────────────┐
  │   time_slots   │                    │ payment_methods │
  │  • day_of_week │                    │ • name, type    │
  │  • start/end   │                    │ • contact_phone │
  │  • capacity    │                    │ • bank_account  │
  │  • slot_type   │                    │ • instructions  │
  │  • specific_dt │                    └─────────────────┘
  └────────────────┘
                    ┌──────────────────┐
  ┌──────────────┐  │ pricing_packages │
  │ app_settings │  │ • name, credits  │
  │ • key, value │  │ • price, pkg_name│
  └──────────────┘  └──────────────────┘

  ┌──────────────────┐
  │ branding_settings│
  │ • business_name  │
  │ • hero_title     │
  │ • contact, images│
  └──────────────────┘
```

### 8.2 Entidades Principales

| Entidad               | Descripción              | Campos Clave                                                                  |
| --------------------- | ------------------------ | ----------------------------------------------------------------------------- |
| **profiles**          | Usuarios del sistema     | id, email, role, credits, approval_status, physical_objective, payment_status |
| **bookings**          | Reservas de clases       | user_id, time_slot_id, booking_date, status, created_by                       |
| **time_slots**        | Horarios disponibles     | day_of_week, start_time, end_time, capacity, slot_type, specific_date         |
| **payment_requests**  | Solicitudes de créditos  | user_id, credits_requested, status, payment_method_id, admin_notes            |
| **pricing_packages**  | Paquetes de precios      | name, package_name, credits, price, display_order                             |
| **payment_methods**   | Métodos de pago          | name, type, contact_info, bank_account, instructions                          |
| **weight_stats**      | Estadísticas corporales  | user*id, weight, bmi, body_fat*%, muscle_mass, bone_mass, metabolic_age       |
| **branding_settings** | Configuración de landing | business_name, hero_title, images, contact, testimonials, schedule_info       |

---

## 9. User Flows

### 9.1 Flow: Reservar una Clase

```
┌─────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Login  │ →  │  Dashboard  │ →  │   Calendario │ →  │  Slot       │
│         │    │  (Créditos) │    │   (Semana)   │    │  Disponible │
└─────────┘    └─────────────┘    └──────────────┘    └──────┬──────┘
                                                              │
                                                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  ¿Tiene créditos?                                                   │
│                                                                     │
│  SÍ → Confirmar reserva → Deducir crédito → Toast "Reserva OK"     │
│                                                                     │
│  NO → Mostrar modal "Sin créditos" → Link a "Comprar créditos"     │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 Flow: Comprar Créditos

```
┌─────────────┐    ┌────────────────┐    ┌───────────────┐
│  Dashboard  │ →  │ Comprar Créd.  │ →  │ Seleccionar   │
│  (0 créd.)  │    │ (Ver paquetes) │    │ Paquete       │
└─────────────┘    └────────────────┘    └───────┬───────┘
                                                  │
    ┌─────────────────────────────────────────────┘
    ↓
┌──────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Seleccionar      │ →  │ Enviar          │ →  │ Confirmación    │
│ Método de Pago   │    │ Solicitud       │    │ "Pendiente"     │
└──────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                    ┌───────────────────────────────────┘
                    ↓
            ┌───────────────┐
            │ Admin aprueba │
            └───────┬───────┘
                    │
                    ↓
            ┌───────────────────────────┐
            │ Créditos añadidos al      │
            │ perfil del usuario        │
            └───────────────────────────┘
```

### 9.3 Flow: Administrador Aprueba Solicitud

```
┌─────────────┐    ┌────────────────┐    ┌───────────────────┐
│  Dashboard  │ →  │ Solicitudes    │ →  │ Detalle           │
│  Admin      │    │ Pendientes     │    │ Solicitud         │
└─────────────┘    └────────────────┘    └─────────┬─────────┘
                                                    │
                            ┌───────────────────────┴───────────────────────┐
                            │                                               │
                            ↓                                               ↓
                   ┌────────────────┐                              ┌────────────────┐
                   │    APROBAR     │                              │   RECHAZAR     │
                   │  (Btn verde)   │                              │  (Btn rojo)    │
                   └────────┬───────┘                              └────────┬───────┘
                            │                                               │
                            ↓                                               ↓
                   ┌────────────────────┐                         ┌─────────────────┐
                   │ Añadir créditos    │                         │ Añadir nota     │
                   │ al perfil usuario  │                         │ de rechazo      │
                   └────────────────────┘                         └─────────────────┘
```

---

## 10. Métricas de Éxito

### 10.1 Métricas de Producto

| Métrica                  | Definición                   | Target   | Frecuencia |
| ------------------------ | ---------------------------- | -------- | ---------- |
| **MAU**                  | Monthly Active Users         | +15% MoM | Mensual    |
| **DAU/MAU**              | Stickiness ratio             | > 30%    | Semanal    |
| **Booking Rate**         | Reservas / Sesiones          | > 60%    | Semanal    |
| **Cancellation Rate**    | Cancelaciones / Reservas     | < 10%    | Semanal    |
| **Credit Purchase Rate** | Usuarios que compran / Total | > 70%    | Mensual    |

### 10.2 Métricas Técnicas

| Métrica                    | Target  | Herramienta        |
| -------------------------- | ------- | ------------------ |
| **Lighthouse Performance** | > 90    | Lighthouse CI      |
| **Error Rate**             | < 0.1%  | Sentry             |
| **API Latency (p95)**      | < 500ms | Supabase Dashboard |
| **Uptime**                 | > 99.9% | Better Uptime      |
| **Build Time**             | < 60s   | Vercel             |

### 10.3 Métricas de Negocio

| Métrica                             | Definición                 | Target   |
| ----------------------------------- | -------------------------- | -------- |
| **Revenue**                         | Créditos vendidos × Precio | +20% MoM |
| **Customer Acquisition Cost (CAC)** | Marketing / Nuevos users   | < €10    |
| **Customer Lifetime Value (LTV)**   | Créditos × Precio lifetime | > €200   |
| **LTV/CAC Ratio**                   | LTV / CAC                  | > 3:1    |

---

## 11. Roadmap

### 11.1 Estado Actual (v1.0 - Completado ✅)

```
┌────────────────────────────────────────────────────────────────────┐
│ ✅ FASE 1 - MVP (Completado)                                       │
├────────────────────────────────────────────────────────────────────┤
│ • Sistema de autenticación (Email + Google)                        │
│ • Panel de cliente completo                                        │
│   - Dashboard con créditos                                         │
│   - Reserva de clases                                              │
│   - Historial de reservas                                          │
│   - Solicitud de créditos                                          │
│ • Panel de administración                                          │
│   - Gestión de usuarios                                            │
│   - Configuración de horarios                                      │
│   - Aprobación de pagos                                            │
│   - Dashboard con métricas                                         │
│ • Estadísticas de peso y composición corporal                      │
│ • Landing page configurable                                        │
│ • Build Android APK/AAB                                            │
│ • Deploy en Vercel                                                 │
└────────────────────────────────────────────────────────────────────┘
```

### 11.2 Próximas Fases (Planificado)

```
┌────────────────────────────────────────────────────────────────────┐
│ 🔄 FASE 2 - Mejoras UX (Q1 2026)                                   │
├────────────────────────────────────────────────────────────────────┤
│ • Push notifications (Capacitor + FCM)                             │
│ • Recordatorios de clase (24h antes)                               │
│ • Widget de calendario para iOS/Android                            │
│ • Modo offline básico                                              │
│ ✅ Tema oscuro completo (Completado)                               │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ 🔮 FASE 3 - Escalabilidad (Q2 2026)                                │
├────────────────────────────────────────────────────────────────────┤
│ • Multi-tenant (múltiples negocios)                                │
│ • Pasarela de pagos online (Stripe)                                │
│ • Planes de suscripción mensuales                                  │
│ • App iOS nativa                                                   │
│ • API pública para integraciones                                   │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ 💫 FASE 4 - Premium Features (Q3-Q4 2026)                          │
├────────────────────────────────────────────────────────────────────┤
│ • Programas de entrenamiento personalizados                        │
│ • Videos on-demand integrados                                      │
│ • Gamificación (badges, streaks)                                   │
│ • Comunidad y chat entre usuarios                                  │
│ • Marketplace de entrenadores                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 12. Riesgos y Mitigaciones

### 12.1 Matriz de Riesgos

| ID  | Riesgo                             | Probabilidad | Impacto | Score | Mitigación                                           |
| --- | ---------------------------------- | ------------ | ------- | ----- | ---------------------------------------------------- |
| R1  | Baja adopción por usuarios mayores | Media        | Alto    | 6     | UX simplificado, onboarding guiado, soporte WhatsApp |
| R2  | Downtime de Supabase               | Baja         | Alto    | 4     | Monitoreo, fallbacks, comunicación proactiva         |
| R3  | Fraude en solicitudes de pago      | Baja         | Medio   | 3     | Aprobación manual obligatoria, límites               |
| R4  | Escalabilidad de PostgreSQL        | Baja         | Alto    | 4     | Índices optimizados, upgrade plan Supabase           |
| R5  | Competencia con features avanzadas | Media        | Medio   | 4     | Foco en simplicidad como diferenciador               |
| R6  | Cambios regulatorios (GDPR, etc)   | Baja         | Medio   | 3     | Infraestructura EU, derecho al olvido                |

### 12.2 Plan de Contingencia

| Evento                  | Acción Inmediata                                       | Responsable |
| ----------------------- | ------------------------------------------------------ | ----------- |
| **Downtime > 30min**    | Comunicar en redes, ETA de resolución                  | Admin       |
| **Breach de seguridad** | Invalidar tokens, notificar usuarios, post-mortem      | Admin       |
| **Pérdida de datos**    | Restaurar desde backup Supabase (automático cada hora) | Admin       |

---

## 📝 Historial de Cambios

| Versión | Fecha      | Cambios                                                   | Autor  |
| ------- | ---------- | --------------------------------------------------------- | ------ |
| 1.0     | 18/01/2026 | Versión inicial del PRD                                   | Jetezz |
| 1.1     | 21/01/2026 | Actualización de schema y nuevas funcionalidades de admin | Jetezz |

---

## 📎 Anexos

- [README.md](../README.md) - Documentación técnica
- [REFACTOR_ARCHITECTURE.md](../REFACTOR_ARCHITECTURE.md) - Arquitectura detallada
- [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md) - Esquema de base de datos

---

<div align="center">

**Calistenia Emérita** - Sistema de Gestión de Clases de Calistenia

_Documento generado el 18 de Enero de 2026_

</div>
