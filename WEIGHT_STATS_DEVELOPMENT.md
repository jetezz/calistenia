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

## Métricas a Implementar

1. **Peso Corporal** (weight) - Peso total en kg
2. **Porcentaje de Grasa Corporal** (body_fat_percentage) - Proporción de grasa
3. **Masa Muscular** (muscle_mass) - Masa de tejido muscular en kg
4. **Masa Ósea** (bone_mass) - Peso del tejido óseo en kg
5. **Índice de Masa Corporal** (bmi) - Relación peso/altura (kg/m²)
6. **Ingesta Diaria de Calorías** (daily_calorie_intake) - Calorías recomendadas
7. **Edad Metabólica** (metabolic_age) - Edad del metabolismo
8. **Porcentaje de Agua Corporal** (total_body_water_percentage) - Porcentaje de agua

## Librería de Gráficos Seleccionada

**Recharts** - Recomendada para este proyecto por:
- ✅ Simplicidad y facilidad de uso
- ✅ Renderizado SVG limpio y responsive
- ✅ Integración perfecta con React
- ✅ Amplia documentación y comunidad
- ✅ Ideal para gráficos de línea temporal (weight tracking)
- ✅ Soporte para interactividad (tooltips, zoom)

**Fuentes:**
- [Best React Chart Libraries 2026 - LogRocket](https://blog.logrocket.com/best-react-chart-libraries-2025/)
- [Top 7 React Chart Libraries - DEV Community](https://dev.to/basecampxd/top-7-react-chart-libraries-for-2026-features-use-cases-and-benchmarks-412c)
- [8 Best React Chart Libraries - Embeddable](https://embeddable.com/blog/react-chart-libraries)

---

## PLAN DE DESARROLLO POR FASES

### FASE 1: Base de Datos y Migración
**Estado:** ✅ COMPLETADO

#### Tarea 1.1: Crear migración SQL para tabla weight_stats ✅ COMPLETADO
- [x] Crear archivo de migración `20260112000000_weight_stats.sql`
- [x] Definir tabla `weight_stats` con todas las métricas
- [x] Crear índices para user_id y recorded_at
- [x] Implementar políticas RLS (Row Level Security)
- [x] Crear función helper para actualizar updated_at
- [x] Crear funciones helper adicionales (get_latest, get_by_date_range, calculate_weight_change)

#### Tarea 1.2: Actualizar tipos TypeScript de Supabase ✅ COMPLETADO
- [x] Ejecutar comando `pnpm types` para regenerar tipos
- [x] Verificar que los tipos de `weight_stats` se generaron correctamente

---

### FASE 2: Capa de Servicios
**Estado:** ✅ COMPLETADO

#### Tarea 2.1: Crear weightStatsService.ts ✅ COMPLETADO
- [x] Crear archivo `/src/services/weightStatsService.ts`
- [x] Implementar métodos CRUD básicos (getAll, create, update, delete)
- [x] Implementar método `getByUserId` para obtener stats de un usuario
- [x] Implementar método `getLatestByUserId` para obtener la última medición
- [x] Implementar método `getByDateRange` para filtros de fecha
- [x] Añadir tipos `WeightStats`, `WeightStatsInsert`, `WeightStatsUpdate`
- [x] Exportar servicio con interface CrudService
- [x] Implementar métodos adicionales (getRecentByUserId, countByUserId, getDateRangeByUserId)
- [x] Implementar métodos RPC para usar funciones SQL optimizadas

---

### FASE 3: Estado Global (Store)
**Estado:** ✅ COMPLETADO

#### Tarea 3.1: Crear weightStatsStore.ts ✅ COMPLETADO
- [x] Crear archivo `/src/stores/weightStatsStore.ts`
- [x] Extender BaseStoreState con métodos específicos
- [x] Implementar `fetchByUserId` para cargar stats del usuario actual
- [x] Implementar `fetchLatest` para obtener última medición
- [x] Implementar filtrado por rango de fechas
- [x] Añadir estado para gráfico (filtro de tiempo: 7d, 1m, 3m, 6m, 1y, all)
- [x] Implementar optimistic updates para nueva medición
- [x] Implementar métodos de análisis (calculateChange, getCount, getDateRange)
- [x] Añadir helper functions para filtrado temporal automático

---

### FASE 4: Hooks Personalizados
**Estado:** ✅ COMPLETADO

#### Tarea 4.1: Crear hooks para Weight Stats ✅ COMPLETADO
- [x] Crear carpeta `/src/hooks/client/WeightStats/`
- [x] Crear `useWeightStatsLogic.ts` (lógica principal de la página)
- [x] Crear `useWeightStatsForm.ts` (formulario de nueva medición)
- [x] Crear `useWeightStatsCharts.ts` (lógica de gráficos)
- [x] Implementar validaciones de formulario
- [x] Implementar formateo de datos para Recharts

---

### FASE 5: Componentes UI
**Estado:** ⏳ Pendiente

#### Tarea 5.1: Instalar Recharts
- [ ] Ejecutar `pnpm add recharts`
- [ ] Verificar instalación correcta

#### Tarea 5.2: Crear componentes de gráficos
- [ ] Crear carpeta `/src/components/weight-stats/`
- [ ] Crear `WeightChart.tsx` (gráfico de peso)
- [ ] Crear `BodyCompositionChart.tsx` (grasa, músculo, hueso)
- [ ] Crear `MetricsOverview.tsx` (tarjetas con últimos valores)
- [ ] Crear `TimeRangeSelector.tsx` (selector 7d, 1m, 3m, etc)
- [ ] Crear `AddMeasurementForm.tsx` (formulario de nueva medición)

#### Tarea 5.3: Crear componentes helper
- [ ] Crear `StatCard.tsx` (tarjeta individual de métrica)
- [ ] Crear `EmptyState.tsx` (estado vacío cuando no hay datos)
- [ ] Crear `LoadingCharts.tsx` (skeleton para gráficos)

---

### FASE 6: Pantalla Principal
**Estado:** ⏳ Pendiente

#### Tarea 6.1: Crear WeightStatsPage
- [ ] Crear archivo `/src/screens/client/WeightStatsPage.tsx`
- [ ] Implementar layout principal con tabs/secciones
- [ ] Integrar componentes de gráficos
- [ ] Integrar formulario de nueva medición
- [ ] Implementar estado de carga y errores
- [ ] Añadir responsive design (mobile-first)

#### Tarea 6.2: Añadir ruta en React Router
- [ ] Editar `/src/app/router/index.tsx`
- [ ] Añadir ruta `/app/weight-stats`
- [ ] Verificar protección de ruta (solo clientes)

---

### FASE 7: Navegación y Menú
**Estado:** ⏳ Pendiente

#### Tarea 7.1: Actualizar menú de cliente
- [ ] Editar `/src/components/layout/MobileNav.tsx`
- [ ] Añadir item "Estadísticas" con icono apropiado (Activity o TrendingUp)
- [ ] Añadir en array `clientNavItems`

#### Tarea 7.2: Añadir acceso rápido desde HomePage (opcional)
- [ ] Editar `/src/screens/client/HomePage.tsx`
- [ ] Añadir botón de acceso rápido a Weight Stats
- [ ] Mostrar preview de última medición (si existe)

---

### FASE 8: Testing y Refinamiento
**Estado:** ⏳ Pendiente

#### Tarea 8.1: Pruebas funcionales
- [ ] Probar creación de nueva medición
- [ ] Probar visualización de gráficos con diferentes rangos
- [ ] Probar responsive design en móvil
- [ ] Probar manejo de errores
- [ ] Probar con usuario sin datos (empty state)

#### Tarea 8.2: Optimizaciones
- [ ] Verificar performance de gráficos con muchos datos
- [ ] Implementar lazy loading de componentes pesados
- [ ] Optimizar queries de Supabase (índices, filtros)

#### Tarea 8.3: Documentación
- [ ] Documentar componentes principales
- [ ] Actualizar README principal del proyecto

---

## Estructura de Archivos a Crear

```
calistenia/
├── supabase/
│   └── migrations/
│       └── 20260112000000_weight_stats.sql ................... ✅ Completado
├── src/
│   ├── components/
│   │   └── weight-stats/
│   │       ├── WeightChart.tsx .............................. ⏳ Pendiente
│   │       ├── BodyCompositionChart.tsx ..................... ⏳ Pendiente
│   │       ├── MetricsOverview.tsx .......................... ⏳ Pendiente
│   │       ├── TimeRangeSelector.tsx ........................ ⏳ Pendiente
│   │       ├── AddMeasurementForm.tsx ....................... ⏳ Pendiente
│   │       ├── StatCard.tsx ................................. ⏳ Pendiente
│   │       ├── EmptyState.tsx ............................... ⏳ Pendiente
│   │       └── LoadingCharts.tsx ............................ ⏳ Pendiente
│   ├── hooks/
│   │   └── client/
│   │       └── WeightStats/
│   │           ├── useWeightStatsLogic.ts ................... ⏳ Pendiente
│   │           ├── useWeightStatsForm.ts .................... ⏳ Pendiente
│   │           └── useWeightStatsCharts.ts .................. ⏳ Pendiente
│   ├── screens/
│   │   └── client/
│   │       └── WeightStatsPage.tsx .......................... ⏳ Pendiente
│   ├── services/
│   │   └── weightStatsService.ts ............................ ✅ Completado
│   └── stores/
│       └── weightStatsStore.ts .............................. ✅ Completado
└── WEIGHT_STATS_DEVELOPMENT.md .............................. ✅ Completado
```

---

## Notas Técnicas

### Patrón de Arquitectura
Siguiendo los patrones establecidos en el proyecto:
- **Service Layer**: CRUD + métodos especializados con Supabase client
- **Store Layer**: Zustand con BaseStore pattern + optimistic updates
- **Hook Layer**: Lógica de negocio y UI separada
- **Component Layer**: Componentes presentacionales reutilizables

### Políticas de Seguridad (RLS)
Cada usuario solo puede:
- Ver sus propias mediciones
- Crear sus propias mediciones
- Actualizar/eliminar sus propias mediciones

### Performance Considerations
- Lazy loading de gráficos (React.lazy)
- Memoización de cálculos pesados (useMemo)
- Debounce en formularios
- Paginación/límite de datos históricos (ej: últimos 2 años)

---

## Estado Global del Proyecto

**Última actualización:** 2026-01-12
**Tareas completadas:** 1 / 32
**Progreso:** 3%

---

## Leyenda de Estados
- ✅ **Completado** - Tarea finalizada y verificada
- 🚧 **En Progreso** - Tarea actualmente en desarrollo
- ⏳ **Pendiente** - Tarea no iniciada
- ❌ **Bloqueado** - Tarea con impedimentos
✅ Desarrollo completado!
