<div align="center">

# 🏋️ Calistenia Emérita

### _Sistema de Gestión de Clases de Calistenia_

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-2.89-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.0-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

### 🚀 Accesos Directos

[![Landing Page](https://img.shields.io/badge/🏠_Landing_Page-Visitar-4CAF50?style=for-the-badge)](https://emerita.vercel.app/)
[![Aplicación Web](https://img.shields.io/badge/📱_App_Web-Entrar-2196F3?style=for-the-badge)](https://emerita.vercel.app/app)
[![Documentación](https://img.shields.io/badge/📚_Docs-Leer-FF9800?style=for-the-badge)](./REFACTOR_ARCHITECTURE.md)
[![Android APK](https://img.shields.io/badge/📥_Android_APK-Descargar-00C853?style=for-the-badge)](#-instalación-de-la-app-android)

</div>

---

## 📖 Índice

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Builds y Deployment](#-builds-y-deployment)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)

---

## 🎯 Acerca del Proyecto

**Calistenia Emérita** es una aplicación web y móvil diseñada para democratizar el acceso a una vida activa a través de la calistenia. La plataforma conecta a usuarios con un sistema de reservas de clases, gestión de créditos y pagos.

### Buyer Persona: "Miguel Ángel"

- **Edad**: 40-50 años
- **Prioridad**: Salud sobre estética
- **Preocupación**: Prevención de lesiones
- **Necesidad**: Compromiso externo (citas) para mantener la constancia

### Filosofía de Diseño

- ✅ **Mobile First** - Optimizado para smartphones
- ✅ **Simplicidad Extrema** - Botones grandes, texto claro, alto contraste
- ✅ **Accesibilidad** - Pensado para no nativos digitales
- ✅ **Interacción Directa** - Sin complejidad innecesaria

---

## ✨ Características Principales

<table>
  <tr>
    <td align="center" width="50%">
      <h3>👤 Panel de Cliente</h3>
      <ul align="left">
        <li>🔐 Autenticación con email y Google</li>
        <li>📅 Reserva de clases en tiempo real</li>
        <li>💳 Sistema de créditos virtuales</li>
        <li>🔔 Notificaciones de confirmación</li>
        <li>📊 Historial de reservas</li>
        <li>💰 Solicitud de paquetes de créditos</li>
        <li>📈 Estadísticas de peso y composición corporal</li>
      </ul>
    </td>
    <td align="center" width="50%">
      <h3>👨‍💼 Panel de Admin</h3>
      <ul align="left">
        <li>👥 Gestión de usuarios y perfiles</li>
        <li>🕐 Configuración de horarios semanales y clases únicas</li>
        <li>📋 Vista de reservas, capacidad y confirmación auto/manual</li>
        <li>💵 Aprobación de solicitudes de pago con notas</li>
        <li>⚙️ Configuración de precios, paquetes y métodos de pago</li>
        <li>🎨 Personalización completa de branding (Textos, Imágenes, Testimonios)</li>
        <li>📱 Gestión dinámica del menú inferior de la app</li>
        <li>📈 Dashboard con estadísticas en tiempo real</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠 Stack Tecnológico

### Frontend

| Tecnología        | Versión        | Propósito                                       |
| ----------------- | -------------- | ----------------------------------------------- |
| **React**         | 19.2           | UI library con las últimas características      |
| **TypeScript**    | 5.9+           | Type safety y developer experience              |
| **Vite**          | 7.2 (Rolldown) | Fast development y build ultrarrápido           |
| **Tailwind CSS**  | 4.1            | Utility-first styling con CSS variables nativas |
| **shadcn/ui**     | latest         | Componentes accesibles con Radix UI             |
| **Lucide React**  | latest         | Iconografía moderna                             |
| **Framer Motion** | 12.25          | Animaciones fluidas                             |
| **Zustand**       | 5.0            | State management ligero y eficiente             |

### Backend & Infrastructure

| Tecnología     | Propósito                                  |
| -------------- | ------------------------------------------ |
| **Supabase**   | Backend as a Service (Auth, Database, RLS) |
| **PostgreSQL** | Base de datos relacional                   |
| **Vercel**     | Hosting y deployment web                   |
| **Capacitor**  | Cross-platform mobile apps (Android/iOS)   |

### Tools & Package Manager

- **pnpm** 9.x - Fast, efficient package manager
- **ESLint** - Code quality y linting
- **React Router** 7.x - Client-side navigation

---

## 🏗 Arquitectura

Este proyecto sigue una **arquitectura limpia de 3 capas** con separación estricta de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                     UX Layer (React)                        │
│                   Screens & Components                      │
│              Pure presentation & user interaction           │
└────────────────────────┬────────────────────────────────────┘
                         │ Only uses Hooks
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                       │
│                   Custom Hooks                              │
│         Orchestrates business rules & data flow             │
└────────────────────────┬────────────────────────────────────┘
                         │ Calls Stores
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│              Stores (Zustand) + Services                    │
│        State management + database operations               │
└────────────────────────┬────────────────────────────────────┘
                         │ API Calls
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Database (Supabase)                        │
│            PostgreSQL + Row Level Security                  │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
User Action → Component → Hook → Store → Service → Database
     ↓           ↓         ↓       ↓        ↓         ↓
UI Event → Event Handler → Business → State → DB Call → Response
     ↓           ↓         ↓       ↓        ↓         ↓
  Result ← UI Update ← Hook Resp ← Store ← Service ← DB Data
```

> 📚 **Documentación completa de arquitectura**: [REFACTOR_ARCHITECTURE.md](./REFACTOR_ARCHITECTURE.md)

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 18.x
- **pnpm** >= 9.x
- **Supabase CLI** (opcional para desarrollo)

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/calistenia.git
cd calistenia
```

### 2️⃣ Instalar Dependencias

```bash
pnpm install
```

### 3️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

> 💡 **Nota**: Obtén las credenciales desde tu proyecto de Supabase en [supabase.com](https://supabase.com)

### 4️⃣ Configurar la Base de Datos

1. Crea un proyecto en Supabase
2. Ejecuta las migraciones SQL desde la carpeta `supabase/migrations/`
3. Configura las políticas de Row Level Security (RLS)

> Ver esquema completo en [Base de Datos](#-base-de-datos)

### 5️⃣ Ejecutar en Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📦 Builds y Deployment

### 🌐 Build Web (Vercel)

#### Build de Producción

```bash
pnpm build:web
```

#### Vista Previa Local

```bash
pnpm preview
```

#### Deploy a Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

El archivo `vercel.json` ya está configurado para SPA routing.

---

### 📱 Instalación de la App Android

#### Prerrequisitos Móvil

- **Android Studio** con Android SDK
- **JDK** 17+
- **Gradle** (incluido en Android Studio)

#### Build APK (Debug)

```bash
pnpm build:apk
```

El APK se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Build AAB (Release - Play Store)

```bash
pnpm build:aab
```

El AAB se generará en: `android/app/build/outputs/bundle/release/app-release.aab`

#### Sincronizar Capacitor Manualmente

```bash
pnpm sync:android
```

#### Abrir en Android Studio

```bash
npx cap open android
```

> 📱 **Configuración de Capacitor**: Ver [capacitor.config.ts](./capacitor.config.ts)

---

## 📂 Estructura del Proyecto

```
calistenia/
│
├── src/
│   ├── screens/              # 🖥️ Vistas de la aplicación
│   │   ├── client/           # Vistas de cliente (Booking, Profile, etc.)
│   │   └── admin/            # Vistas de admin (Dashboard, Users, etc.)
│   │
│   ├── hooks/                # 🎣 Custom hooks (Business logic layer)
│   │   ├── client/           # Hooks específicos del cliente
│   │   └── admin/            # Hooks específicos del admin
│   │
│   ├── stores/               # 🗄️ Zustand stores (State management)
│   │   ├── bookingStore.ts
│   │   ├── profileStore.ts
│   │   ├── paymentRequestStore.ts
│   │   └── ...
│   │
│   ├── services/             # 🔌 Database operations (API layer)
│   │   ├── bookingService.ts
│   │   ├── profileService.ts
│   │   └── ...
│   │
│   ├── components/           # 🧩 Componentes reutilizables
│   │   ├── common/           # Componentes de negocio compartidos
│   │   ├── layout/           # Layout components (Header, Footer, etc.)
│   │   └── ui/               # shadcn/ui components
│   │
│   ├── app/                  # ⚙️ Configuración de la aplicación
│   │   ├── providers/        # Context providers (Auth, Theme)
│   │   └── router/           # Configuración de rutas
│   │
│   ├── lib/                  # 📚 Utilidades y configuraciones
│   ├── types/                # 📝 TypeScript types & interfaces
│   └── utils/                # 🛠️ Utility functions
│
├── supabase/                 # 🗃️ Configuración de Supabase
│   ├── migrations/           # Migraciones SQL
│   └── scripts/              # Scripts de mantenimiento
│
├── public/                   # 📦 Assets estáticos
├── android/                  # 📱 Proyecto Android (Capacitor)
│
├── package.json              # 📦 Dependencies y scripts
├── tsconfig.json             # ⚙️ TypeScript configuration
├── tailwind.config.js        # 🎨 Tailwind configuration
├── vite.config.ts            # ⚡ Vite configuration
├── capacitor.config.ts       # 📱 Capacitor configuration
└── vercel.json               # ☁️ Vercel deployment config
```

---

## 🗄️ Base de Datos

El sistema utiliza **PostgreSQL** con **Supabase** como backend.

### Esquema de Relaciones (ER Diagram)

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
  │  • user_id (FK)│  │ • user_id (FK)│  │ • user_id (FK)   │
  │  • created_by  │  │ • weight, bmi │  │ • credits_req    │
  └────────┬───────┘  │ • body_fat_%  │  │ • status         │
           │          │ • muscle_mass │  └────────┬─────────┘
           │ (N:1)    └───────────────┘           │
           ↓                                      │ (N:1)
  ┌────────────────┐                    ┌─────────────────┐
  │   time_slots   │                    │ payment_methods │
  │  • day_of_week │                    │ • name, type    │
  │  • start/end   │                    │ • contact_phone │
  │  • capacity    │                    │ • bank_account  │
  │  • slot_type   │                    │ • instructions  │
  │  • created_by  │                    └─────────────────┘
  └────────────────┘
                    ┌──────────────────┐
  ┌──────────────┐  │ pricing_packages │
  │ app_settings │  │ • name, credits  │
  │ • key, value │  │ • price          │
  └──────────────┘  └──────────────────┘

  ┌──────────────────┐
  │ branding_settings│
  │ • business_name  │
  │ • hero_title     │
  │ • images, contact│
  └──────────────────┘
```

### 📋 Tablas Principales

<details>
<summary><strong>📊 Ver todas las tablas (10 tablas)</strong></summary>

#### **`profiles`** - Usuarios del Sistema

| Campo                | Tipo        | Descripción                         |
| -------------------- | ----------- | ----------------------------------- |
| `id`                 | UUID (PK)   | FK → `auth.users.id`                |
| `email`              | TEXT        | Email del usuario                   |
| `full_name`          | TEXT        | Nombre completo                     |
| `phone`              | TEXT        | Teléfono                            |
| `role`               | TEXT        | `admin` o `user`                    |
| `credits`            | INTEGER     | Créditos disponibles (default: 0)   |
| `payment_status`     | TEXT        | `paid`, `pending`, `unpaid`, `none` |
| `approval_status`    | TEXT        | Estado de aprobación                |
| `birth_date`         | DATE        | Fecha de nacimiento                 |
| `gender`             | TEXT        | Género                              |
| `height`             | NUMERIC     | Altura en cm                        |
| `physical_objective` | TEXT        | Objetivo físico                     |
| `created_at`         | TIMESTAMPTZ | Fecha de creación                   |
| `updated_at`         | TIMESTAMPTZ | Última actualización                |

#### **`bookings`** - Reservas de Clases

| Campo          | Tipo        | Descripción                           |
| -------------- | ----------- | ------------------------------------- |
| `id`           | UUID (PK)   | ID de la reserva                      |
| `user_id`      | UUID (FK)   | Usuario → `profiles.id`               |
| `time_slot_id` | UUID (FK)   | Slot → `time_slots.id`                |
| `booking_date` | DATE        | Fecha de la clase                     |
| `status`       | TEXT        | `confirmed`, `cancelled`, `completed` |
| `created_by`   | UUID (FK)   | Admin (null=auto-reserva)             |
| `created_at`   | TIMESTAMPTZ | Fecha de creación                     |
| `updated_at`   | TIMESTAMPTZ | Última actualización                  |

**Constraint**: `UNIQUE(user_id, time_slot_id, booking_date)`

#### **`time_slots`** - Horarios de Clases

| Campo           | Tipo        | Descripción                   |
| --------------- | ----------- | ----------------------------- |
| `id`            | UUID (PK)   | ID del slot                   |
| `day_of_week`   | INTEGER     | 0=Domingo, 6=Sábado           |
| `start_time`    | TIME        | Hora de inicio                |
| `end_time`      | TIME        | Hora de fin                   |
| `capacity`      | INTEGER     | Capacidad máxima (default: 4) |
| `is_active`     | BOOLEAN     | Si está activo                |
| `slot_type`     | TEXT        | `recurring` o `one_time`      |
| `specific_date` | DATE        | Fecha (solo one_time)         |
| `created_by`    | UUID (FK)   | Admin → `profiles.id`         |
| `created_at`    | TIMESTAMPTZ | Fecha de creación             |
| `updated_at`    | TIMESTAMPTZ | Última actualización          |

#### **`weight_stats`** - Estadísticas de Composición Corporal

| Campo                         | Tipo        | Descripción             |
| ----------------------------- | ----------- | ----------------------- |
| `id`                          | UUID (PK)   | ID de la estadística    |
| `user_id`                     | UUID (FK)   | Usuario → `profiles.id` |
| `weight`                      | NUMERIC     | Peso en kg              |
| `bmi`                         | NUMERIC     | Índice de masa corporal |
| `body_fat_percentage`         | NUMERIC     | % grasa corporal        |
| `muscle_mass`                 | NUMERIC     | Masa muscular           |
| `bone_mass`                   | NUMERIC     | Masa ósea               |
| `total_body_water_percentage` | NUMERIC     | % agua corporal         |
| `metabolic_age`               | INTEGER     | Edad metabólica         |
| `daily_calorie_intake`        | INTEGER     | Calorías diarias        |
| `notes`                       | TEXT        | Notas                   |
| `recorded_at`                 | TIMESTAMPTZ | Fecha de medición       |
| `created_at`                  | TIMESTAMPTZ | Fecha de creación       |
| `updated_at`                  | TIMESTAMPTZ | Última actualización    |

#### **`payment_requests`** - Solicitudes de Créditos

| Campo               | Tipo        | Descripción                       |
| ------------------- | ----------- | --------------------------------- |
| `id`                | UUID (PK)   | ID de la solicitud                |
| `user_id`           | UUID (FK)   | Usuario → `profiles.id`           |
| `credits_requested` | INTEGER     | Créditos solicitados              |
| `status`            | TEXT        | `pending`, `approved`, `rejected` |
| `payment_method_id` | UUID (FK)   | Método → `payment_methods.id`     |
| `admin_notes`       | TEXT        | Notas del admin                   |
| `processed_by`      | UUID (FK)   | Admin → `profiles.id`             |
| `processed_at`      | TIMESTAMPTZ | Fecha de procesamiento            |
| `created_at`        | TIMESTAMPTZ | Fecha de creación                 |
| `updated_at`        | TIMESTAMPTZ | Última actualización              |

#### **`pricing_packages`** - Paquetes de Precios

| Campo           | Tipo        | Descripción            |
| --------------- | ----------- | ---------------------- |
| `id`            | UUID (PK)   | ID del paquete         |
| `name`          | TEXT        | Nombre descriptivo     |
| `package_name`  | TEXT        | Nombre comercial       |
| `credits`       | INTEGER     | Número de clases       |
| `price`         | NUMERIC     | Precio en EUR          |
| `is_active`     | BOOLEAN     | Si está disponible     |
| `display_order` | INTEGER     | Orden de visualización |
| `created_at`    | TIMESTAMPTZ | Fecha de creación      |
| `updated_at`    | TIMESTAMPTZ | Última actualización   |

#### **`payment_methods`** - Métodos de Pago

| Campo           | Tipo        | Descripción                                |
| --------------- | ----------- | ------------------------------------------ |
| `id`            | UUID (PK)   | ID del método                              |
| `name`          | TEXT        | Nombre ("Bizum", "PayPal")                 |
| `type`          | TEXT        | `bizum`, `paypal`, `bank_transfer`, `cash` |
| `contact_phone` | TEXT        | Teléfono (Bizum)                           |
| `contact_email` | TEXT        | Email (PayPal)                             |
| `bank_account`  | TEXT        | IBAN                                       |
| `instructions`  | TEXT        | Instrucciones                              |
| `is_active`     | BOOLEAN     | Si está disponible                         |
| `display_order` | INTEGER     | Orden de visualización                     |
| `created_at`    | TIMESTAMPTZ | Fecha de creación                          |
| `updated_at`    | TIMESTAMPTZ | Última actualización                       |

#### **`app_settings`** - Configuración Global

| Campo         | Tipo        | Descripción           |
| ------------- | ----------- | --------------------- |
| `id`          | UUID (PK)   | ID de configuración   |
| `key`         | TEXT        | Clave única           |
| `value`       | JSON        | Valor flexible        |
| `description` | TEXT        | Descripción           |
| `updated_by`  | UUID (FK)   | Admin → `profiles.id` |
| `created_at`  | TIMESTAMPTZ | Fecha de creación     |
| `updated_at`  | TIMESTAMPTZ | Última actualización  |

#### **`branding_settings`** - Configuración de Landing Page

| Campo (resumido)       | Tipo      | Descripción          |
| ---------------------- | --------- | -------------------- |
| `id`                   | UUID (PK) | ID                   |
| `business_name`        | TEXT      | Nombre del negocio   |
| `hero_title/subtitle`  | TEXT      | Textos del hero      |
| `*_image_url`          | TEXT      | URLs de imágenes     |
| `phone/email/whatsapp` | TEXT      | Datos de contacto    |
| `address/city/region`  | TEXT      | Ubicación            |
| `latitude/longitude`   | NUMERIC   | Coordenadas mapa     |
| `schedule_*`           | TEXT      | Horarios             |
| `testimonials`         | JSON      | Array de testimonios |
| `show_*`               | BOOLEAN   | Flags de visibilidad |

**Nota**: Esta tabla tiene +30 campos para personalizar completamente la landing page.

#### **`health_check`** - Health Check del Sistema

| Campo        | Tipo        | Descripción |
| ------------ | ----------- | ----------- |
| `id`         | UUID (PK)   | ID          |
| `status`     | TEXT        | Estado      |
| `created_at` | TIMESTAMPTZ | Fecha check |

</details>

### 🔒 Row Level Security (RLS)

Todas las tablas tienen políticas RLS habilitadas:

- ✅ **Profiles**: Users ven solo su perfil, Admins ven todos
- ✅ **Bookings**: Users ven/crean/cancelan propias, Admins gestionan todas
- ✅ **Time Slots**: Users ven activos, Admins CRUD completo
- ✅ **Weight Stats**: Users ven/crean propias, Admins ven todas
- ✅ **Payment Requests**: Users ven/crean propias, Admins aprueban/rechazan
- ✅ **Pricing & Payment Methods**: Users lectura, Admins CRUD
- ✅ **App Settings & Branding**: Users lectura, Admins CRUD

### 📊 Funciones PostgreSQL

El sistema incluye **10+ funciones** para lógica de negocio:

- `admin_create_user()` - Crear usuarios desde admin
- `calculate_age()` - Calcular edad desde fecha nacimiento
- `calculate_weight_change()` - Cambio de peso en rango fechas
- `get_admin_dashboard_data()` - Datos agregados dashboard
- `get_available_spots()` - Espacios disponibles por slot/fecha
- `get_latest_weight_stat()` - Última estadística de peso
- `is_admin()` - Verificar si usuario es admin
- Y más...

> 📚 **Esquema completo con diagrama ER**: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
> 💡 **Types TypeScript**: [src/types/database.ts](./src/types/database.ts)

---

## 🎨 Modelos de Dominio

### 1. **Profile Model** - Gestión de Usuarios y Créditos

**Objetivo**: Identidad de usuario, roles y sistema de créditos virtuales.

**Reglas de Negocio**:

- Los usuarios empiezan con 0 créditos
- Se requiere aprobación del admin para solicitudes de créditos
- Los créditos se deducen automáticamente al confirmar reserva
- Prevención de escalada de privilegios (users no pueden auto-promover a admin)

### 2. **TimeSlot Model** - Gestión de Horarios

**Objetivo**: Definir horarios semanales recurrentes con control de capacidad.

**Reglas de Negocio**:

- Cada slot tiene capacidad fija (default 4 personas)
- Los slots son semanalmente recurrentes (ej. Lunes 18:00)
- Solo slots activos son visibles para clientes
- Tracking en tiempo real de disponibilidad

### 3. **Booking Model** - Sistema de Reservas

**Objetivo**: Gestionar reservas con prevención de conflictos y gestión de créditos.

**Reglas de Negocio**:

- Una reserva por usuario/slot/fecha
- Créditos deducidos solo al confirmar (no al crear)
- Usuarios pueden cancelar reservas propias (créditos reembolsados)
- No se permiten reservas de fechas pasadas o slots inactivos

### 4. **PaymentRequest Model** - Compra de Créditos

**Objetivo**: Workflow de aprobación de admin para compra de créditos.

**Reglas de Negocio**:

- Los usuarios solicitan paquetes de créditos predefinidos
- Todas las solicitudes requieren aprobación del admin
- Las solicitudes aprobadas agregan créditos automáticamente
- Una solicitud pendiente por usuario a la vez

---

## 🗺️ Roadmap

### ✅ Completado

- [x] Sistema de autenticación con email y Google
- [x] Panel de cliente con reservas y créditos
- [x] Panel de admin con gestión completa
- [x] Sistema de notificaciones en tiempo real
- [x] Gestión dinámica de precios y métodos de pago
- [x] Configuración de políticas de cancelación y confirmación automática
- [x] Build Android APK/AAB
- [x] Deploy en Vercel
- [x] Sistema de estadísticas de peso y composición corporal (Avanzado)
- [x] Tema oscuro completo y diseño premium con Tailwind 4
- [x] Personalización dinámica de branding y navegación app

---

## 👨‍💻 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev                 # Inicia servidor de desarrollo

# Build
pnpm build              # Build de producción
pnpm build:web          # Build específico web
pnpm preview            # Vista previa del build

# Linting
pnpm lint               # Ejecuta ESLint

# Supabase
pnpm types              # Genera types de Supabase

# Android
pnpm sync:android       # Sincroniza con Android
pnpm build:apk          # Build APK debug
pnpm build:aab          # Build AAB release

# Utilidades
pnpm clean-data         # Limpia datos de desarrollo
```

---

## 📄 Licencia

Este proyecto es privado y no está bajo una licencia open source. Todos los derechos reservados.

---

## 📧 Contacto

Para consultas sobre el proyecto, contacta a:

- **LinkedIn**: [\[Tu Perfil\]](https://www.linkedin.com/in/jesus-cuadra-tellez-0931a6189/)

---

<div align="center">

**Hecho por Jetezz**

⭐ Si te gusta este proyecto, dale una estrella en GitHub

</div>
