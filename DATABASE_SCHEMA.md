# 🗄️ Esquema Completo de Base de Datos

## Diagrama de Relaciones (ER Diagram)

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
  │  • capacity    │                    └─────────────────┘
  │  • slot_type   │
  │  • created_by  │
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

## 📋 Tablas del Sistema

### **`profiles`** - Usuarios del Sistema

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | ID del usuario (FK → `auth.users.id`) |
| `email` | TEXT | Email del usuario |
| `full_name` | TEXT | Nombre completo |
| `phone` | TEXT | Teléfono de contacto |
| `role` | TEXT | `admin` o `user` |
| `credits` | INTEGER | Créditos disponibles (default: 0) |
| `payment_status` | TEXT | `paid`, `pending`, `unpaid`, `none` |
| `approval_status` | TEXT | Estado de aprobación |
| `birth_date` | DATE | Fecha de nacimiento |
| `gender` | TEXT | Género |
| `height` | NUMERIC | Altura en cm |
| `physical_objective` | TEXT | Objetivo físico |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

---

### **`time_slots`** - Horarios de Clases

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | ID del slot |
| `day_of_week` | INTEGER | 0=Domingo, 6=Sábado |
| `start_time` | TIME | Hora de inicio |
| `end_time` | TIME | Hora de fin |
| `capacity` | INTEGER | Capacidad máxima (default: 4) |
| `is_active` | BOOLEAN | Si está activo |
| `slot_type` | TEXT | `recurring` o `one_time` |
| `specific_date` | DATE | Fecha específica (para one_time) |
| `created_by` | UUID (FK) | Admin → `profiles.id` |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

**Constraint**: `UNIQUE(day_of_week, start_time)` para slots recurrentes

---

### **`bookings`** - Reservas de Clases

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | ID de la reserva |
| `user_id` | UUID (FK) | Usuario → `profiles.id` |
| `time_slot_id` | UUID (FK) | Slot → `time_slots.id` |
| `booking_date` | DATE | Fecha de la clase |
| `status` | TEXT | `confirmed`, `cancelled`, `completed` |
| `created_by` | UUID (FK) | Admin (null=auto-reserva) |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

**Constraint**: `UNIQUE(user_id, time_slot_id, booking_date)`

---

### **`weight_stats`** - Estadísticas de Composición Corporal

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | ID de la estadística |
| `user_id` | UUID (FK) | Usuario → `profiles.id` |
| `weight` | NUMERIC | Peso en kg |
| `bmi` | NUMERIC | Índice de masa corporal |
| `body_fat_percentage` | NUMERIC | % grasa corporal |
| `muscle_mass` | NUMERIC | Masa muscular |
| `bone_mass` | NUMERIC | Masa ósea |
| `total_body_water_percentage` | NUMERIC | % agua corporal |
| `metabolic_age` | INTEGER | Edad metabólica |
| `daily_calorie_intake` | INTEGER | Calorías diarias recomendadas |
| `notes` | TEXT | Notas adicionales |
| `recorded_at` | TIMESTAMPTZ | Fecha de medición |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

---

### **`payment_requests`** - Solicitudes de Créditos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | ID de la solicitud |
| `user_id` | UUID (FK) | Usuario → `profiles.id` |
| `credits_requested` | INTEGER | Créditos solicitados |
| `status` | TEXT | `pending`, `approved`, `rejected` |
| `payment_method_id` | UUID (FK) | Método → `payment_methods.id` |
| `admin_notes` | TEXT | Notas del admin |
| `processed_by` | UUID (FK) | Admin → `profiles.id` |
| `processed_at` | TIMESTAMPTZ | Fecha de procesamiento |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

---

### **`pricing_packages`** - Paquetes de Precios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | ID del paquete |
| `name` | TEXT | Nombre descriptivo |
| `package_name` | TEXT | Nombre comercial ("Pack Básico") |
| `credits` | INTEGER | Número de clases |
| `price` | NUMERIC | Precio en EUR |
| `is_active` | BOOLEAN | Si está disponible |
| `display_order` | INTEGER | Orden de visualización |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

---

### **`payment_methods`** - Métodos de Pago

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | ID del método |
| `name` | TEXT | Nombre ("Bizum", "PayPal") |
| `type` | TEXT | `bizum`, `paypal`, `bank_transfer`, `cash` |
| `contact_phone` | TEXT | Teléfono (Bizum) |
| `contact_email` | TEXT | Email (PayPal) |
| `bank_account` | TEXT | IBAN |
| `instructions` | TEXT | Instrucciones de pago |
| `is_active` | BOOLEAN | Si está disponible |
| `display_order` | INTEGER | Orden de visualización |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

---

### **`app_settings`** - Configuración Global

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | ID de configuración |
| `key` | TEXT | Clave única (ej: "cancellation_policy") |
| `value` | JSON | Valor flexible |
| `description` | TEXT | Descripción |
| `updated_by` | UUID (FK) | Admin → `profiles.id` |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

**Ejemplo**:
```json
{
  "key": "cancellation_policy",
  "value": {
    "hours": 2,
    "message": "Cancela con al menos 2 horas"
  }
}
```

---

### **`branding_settings`** - Configuración de Marca (Landing Page)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | ID |
| `business_name` | TEXT | Nombre del negocio |
| `hero_title` | TEXT | Título hero |
| `hero_subtitle` | TEXT | Subtítulo hero |
| `hero_cta_text` | TEXT | Texto botón CTA |
| `hero_image_url` | TEXT | URL imagen hero |
| `logo_url` | TEXT | URL logo |
| `trainer_image_url` | TEXT | URL foto entrenador |
| `group_image_url` | TEXT | URL foto grupal |
| `value_prop_title` | TEXT | Título propuesta valor |
| `value_prop_subtitle` | TEXT | Subtítulo valor |
| `empathy_title` | TEXT | Título empatía |
| `empathy_subtitle` | TEXT | Subtítulo empatía |
| `about_trainer_title` | TEXT | Título "Sobre entrenador" |
| `about_trainer_text` | TEXT | Descripción entrenador |
| `about_trainer_quote` | TEXT | Cita del entrenador |
| `final_cta_title` | TEXT | Título CTA final |
| `final_cta_subtitle` | TEXT | Subtítulo CTA final |
| `phone` | TEXT | Teléfono |
| `email` | TEXT | Email |
| `whatsapp` | TEXT | WhatsApp |
| `instagram` | TEXT | Instagram |
| `address` | TEXT | Dirección |
| `city` | TEXT | Ciudad |
| `region` | TEXT | Región/Provincia |
| `country` | TEXT | País |
| `latitude` | NUMERIC | Latitud mapa |
| `longitude` | NUMERIC | Longitud mapa |
| `google_maps_url` | TEXT | URL Google Maps |
| `schedule_weekdays` | TEXT | Horario lun-vie |
| `schedule_saturday` | TEXT | Horario sábado |
| `schedule_sunday` | TEXT | Horario domingo |
| `testimonials` | JSON | Array testimonios |
| `show_logo` | BOOLEAN | Mostrar logo |
| `show_hero_image` | BOOLEAN | Mostrar imagen hero |
| `show_trainer_image` | BOOLEAN | Mostrar foto entrenador |
| `show_group_image` | BOOLEAN | Mostrar foto grupal |
| `show_phone` | BOOLEAN | Mostrar teléfono |
| `show_email` | BOOLEAN | Mostrar email |
| `show_whatsapp` | BOOLEAN | Mostrar WhatsApp |
| `show_instagram` | BOOLEAN | Mostrar Instagram |
| `show_location` | BOOLEAN | Mostrar ubicación |
| `show_schedule` | BOOLEAN | Mostrar horarios |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

---

### **`health_check`** - Health Check del Sistema

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | ID |
| `status` | TEXT | Estado sistema |
| `created_at` | TIMESTAMPTZ | Fecha check |

---

## 🔒 Row Level Security (RLS)

Todas las tablas tienen políticas RLS habilitadas:

### Profiles
- ✅ Users: Ver/editar solo su perfil
- ✅ Admins: Acceso total

### Time Slots
- ✅ Users: Ver solo activos
- ✅ Admins: CRUD completo

### Bookings
- ✅ Users: Ver/crear/cancelar propias
- ✅ Admins: Gestión total

### Weight Stats
- ✅ Users: Ver/crear/editar propias
- ✅ Admins: Ver todas

### Payment Requests
- ✅ Users: Ver/crear propias
- ✅ Admins: Gestión total (aprobar/rechazar)

### Pricing Packages & Payment Methods
- ✅ Users: Solo lectura (activos)
- ✅ Admins: CRUD completo

### App Settings & Branding
- ✅ Users: Solo lectura
- ✅ Admins: CRUD completo

---

## 📊 Funciones de Base de Datos (PostgreSQL Functions)

### `admin_create_user(p_email, p_full_name, p_password)`
Crea un usuario desde el panel de admin.

### `admin_delete_user(p_user_id)`
Elimina un usuario y todos sus datos relacionados.

### `approve_user(target_user_id)`
Aprueba un usuario pendiente.

### `reject_user(target_user_id)`
Rechaza un usuario pendiente.

### `calculate_age(birth_date)`
Calcula la edad basándose en la fecha de nacimiento.

### `calculate_weight_change(p_user_id, p_start_date, p_end_date)`
Calcula el cambio de peso en un rango de fechas.

### `get_admin_dashboard_data()`
Retorna datos agregados para el dashboard de admin.

### `get_admin_secondary_data()`
Retorna datos secundarios del admin (estadísticas).

### `get_available_spots(slot_id, target_date)`
Calcula los espacios disponibles para un slot en una fecha específica.

### `get_latest_weight_stat(p_user_id)`
Obtiene la estadística de peso más reciente de un usuario.

### `get_weight_stats_by_date_range(p_user_id, p_start_date, p_end_date)`
Obtiene estadísticas de peso en un rango de fechas.

### `is_admin(user_id?)`
Verifica si un usuario es administrador.

---

> 💡 **Archivo de tipos TypeScript completo**: [src/types/database.ts](./src/types/database.ts)
