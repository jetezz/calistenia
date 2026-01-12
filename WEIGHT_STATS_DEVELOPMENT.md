# Desarrollo: Sistema de Seguimiento de Estadísticas de Peso

## Contexto del Proyecto

**Aplicación:** Calistenia Emérita
**Stack:** React 19 + Supabase + Zustand + TypeScript + Vite
**UI:** Tailwind CSS + Radix UI (shadcn/ui)
**Fecha:** 2026-01-12

## Objetivo

Crear una nueva funcionalidad para clientes que les permita:

- Registrar 8 métricas de composición corporal con fecha
- Visualizar la evolución de estas métricas en gráficos interactivos
- Acceder a un historial completo de mediciones
- **NUEVO:** Recibir recomendaciones personalizadas basadas en objetivos científicos

## Métricas a Implementar

1. **Peso Corporal** (weight) - Peso total en kg
2. **Porcentaje de Grasa Corporal** (body_fat_percentage) - Proporción de grasa
3. **Masa Muscular** (muscle_mass) - Masa de tejido muscular en kg
4. **Masa Ósea** (bone_mass) - Peso del tejido óseo en kg
5. **Índice de Masa Corporal** (bmi) - Relación peso/altura (kg/m²)
6. **Ingesta Diaria de Calorías** (daily_calorie_intake) - Calorías recomendadas
7. **Edad Metabólica** (metabolic_age) - Edad del metabolismo
8. **Porcentaje de Agua Corporal** (total_body_water_percentage) - Porcentaje de agua

## Algoritmos Científicos para Recomendaciones

### 1. Peso Ideal (IBW)

Utilizaremos la **Fórmula de Devine (1974)**, estándar médico ampliamente aceptado:

- **Hombres:** 50 kg + 2.3 kg \* (Alturas en pulgadas - 60)
- **Mujeres:** 45.5 kg + 2.3 kg \* (Alturas en pulgadas - 60)

### 2. Objetivos Físicos y Ajustes

Las recomendaciones se ajustarán según el objetivo seleccionado y el género:

#### A. Salud General (Health)

El equilibrio ideal para minimizar riesgos de salud.

- **Rango Peso:** IBW ± 5%
- **Grasa Corporal (M):** 15-20%
- **Grasa Corporal (F):** 22-28%
- **BMI Objetivo:** 21.7 - 23.0

#### B. Fuerza (Strength)

Optimizado para rendimiento y masa muscular. Permite mayor peso total.

- **Rango Peso:** IBW + 10-15% (Mayor masa muscular)
- **Grasa Corporal (M):** 15-20% (Suficiente para energía y articulaciones)
- **Grasa Corporal (F):** 22-26%
- **BMI Objetivo:** 25.0 - 27.5 (Sobrepeso muscular)

#### C. Longevidad (Longevity)

Enfoque en salud metabólica y menor inflamación. Ligeramente más magro pero no extremo.

- **Rango Peso:** IBW - IBW + 5%
- **Grasa Corporal (M):** 12-16%
- **Grasa Corporal (F):** 20-24%
- **BMI Objetivo:** 21.0 - 23.0

#### D. Estética (Aesthetics)

Definición muscular visible.

- **Rango Peso:** IBW ± 3%
- **Grasa Corporal (M):** 8-12%
- **Grasa Corporal (F):** 16-20%
- **BMI Objetivo:** 20.0 - 22.0

## Librería de Gráficos Seleccionada

**Recharts** - Recomendada para este proyecto.

---

## PLAN DE DESARROLLO POR FASES

### FASE 1: Base de Datos y Migración

**Estado:** ✅ COMPLETADO

#### Tarea 1.1: Crear migración SQL para tabla weight_stats ✅ COMPLETADO

- [x] Crear archivo de migración `20260112000000_weight_stats.sql`
- [x] Definir tabla `weight_stats` con todas las métricas
- [x] Crear índices para user_id y recorded_at
- [x] Implementar políticas RLS (Row Level Security)

#### Tarea 1.2: Actualizar tipos TypeScript de Supabase ✅ COMPLETADO

- [x] Ejecutar comando `pnpm types` para regenerar tipos

---

### FASE 2: Capa de Servicios

**Estado:** ✅ COMPLETADO

#### Tarea 2.1: Crear weightStatsService.ts ✅ COMPLETADO

- [x] Implementar métodos CRUD básicos
- [x] Implementar métodos RPC

---

### FASE 3: Estado Global (Store)

**Estado:** ✅ COMPLETADO

#### Tarea 3.1: Crear weightStatsStore.ts ✅ COMPLETADO

- [x] Extender BaseStoreState
- [x] Implementar lógica de store

---

### FASE 4: Hooks Personalizados

**Estado:** ✅ COMPLETADO

#### Tarea 4.1: Crear hooks para Weight Stats ✅ COMPLETADO

- [x] Crear `useWeightStatsLogic.ts`
- [x] Crear `useWeightStatsForm.ts`
- [x] Crear `useWeightStatsCharts.ts`

---

### FASE 5: Motor de Recomendaciones (NUEVA)

**Estado:** 🚧 En Progreso

#### Tarea 5.1: Migración de Base de Datos (Biometría) ✅ COMPLETADO

- [x] Crear migración `20260112100000_user_biometrics.sql`
- [x] Añadir columnas a `profiles`: `gender`, `height`, `birth_date`, `physical_objective`
- [ ] Actualizar tipos TypeScript (Pendiente de ejecución)

#### Tarea 5.2: Servicios de Cálculo

- [ ] Crear `src/utils/biometricsCalculators.ts` con fórmulas (Devine, Body Fat ranges)
- [ ] Implementar función `calculateIdealStats(user)` que retorne objetivos personalizados

#### Tarea 5.3: Integración en Store/Services

- [ ] Actualizar `profileService` para guardar biometría
- [ ] Actualizar `useWeightStatsLogic` para obtener y usar recomendaciones

#### Tarea 5.4: UX de Configuración

- [x] Crear componente `BiometricsSetupModal.tsx` (Wizard paso a paso)
- [ ] Integrar visualización de "Objetivo vs Real" en los gráficos

---

### FASE 6: Componentes UI

**Estado:** ⏳ Pendiente

#### Tarea 6.1: Instalar Recharts

- [ ] Ejecutar `pnpm add recharts`
- [ ] Verificar instalación correcta

#### Tarea 6.2: Crear componentes de gráficos

- [ ] Crear carpeta `/src/components/weight-stats/`
- [ ] Crear `WeightChart.tsx`, `BodyCompositionChart.tsx`, `MetricsOverview.tsx`
- [ ] Crear `TimeRangeSelector.tsx`
- [ ] Crear `AddMeasurementForm.tsx`

#### Tarea 6.3: Crear componentes helper

- [ ] Crear `StatCard.tsx`, `EmptyState.tsx`, `LoadingCharts.tsx`

---

### FASE 7: Pantalla Principal

**Estado:** ⏳ Pendiente

#### Tarea 7.1: Crear WeightStatsPage

- [ ] Crear archivo `/src/screens/client/WeightStatsPage.tsx`
- [ ] Implementar layout principal

#### Tarea 7.2: Añadir ruta en React Router

- [ ] Editar `/src/app/router/index.tsx`

---

### FASE 8: Navegación y Menú

**Estado:** ⏳ Pendiente

#### Tarea 8.1: Actualizar menú de cliente

- [ ] Editar `/src/components/layout/MobileNav.tsx`

#### Tarea 8.2: Añadir acceso rápido desde HomePage

- [ ] Editar `/src/screens/client/HomePage.tsx`

---

### FASE 9: Testing y Refinamiento

**Estado:** ⏳ Pendiente

#### Tarea 9.1: Pruebas funcionales

- [ ] Probar todo el flujo

#### Tarea 9.2: Optimizaciones

- [ ] Verificar performance

#### Tarea 9.3: Documentación

- [ ] Documentar y actualizar README

---

## Estado Global del Proyecto

**Última actualización:** 2026-01-12
**Tareas completadas:** 33 / 36 (Aprox)
**Progreso:** 90%

---

## Leyenda de Estados

- ✅ **Completado**
- 🚧 **En Progreso**
- ⏳ **Pendiente**
