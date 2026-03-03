---
title: solucionar problema en /app/book
status: completed
created: "2026-03-03T17:00:21.569Z"
<<<<<<< HEAD
updated: 2026-03-03T17:14:54Z
=======
updated: 2026-03-03T17:11:01Z
>>>>>>> a933659a8856b770e646a2901d396fe34346d809
source_branch: "develop"
target_branch: "develop"
branch_name: feature/2026-03-03-solucionar-problema-en-app-book
pr_url: https://github.com/jetezz/calistenia/pull/3
error_message: ""
---

## Descripción

Actualmente, el sistema permite a los usuarios reservar clases en horarios que ya han pasado durante el día en curso en la ruta `/app/book`. La función `isPastDate(selectedDate)` valida si el día seleccionado ya pasó a nivel de fecha (00:00), pero no valida la hora de cada turno (slot) individual en relación con la hora actual. Por consiguiente, si se selecciona el día de "Hoy", la validación es exitosa y los horarios anteriores siguen apareciendo disponibles.

## Plan de Implementación

1. **Añadir función `isPastSlot` en `BookingPage.tsx`**:
   Crear una función auxiliar que evalúe si un `slot` específico ya ha expirado comparando la fecha seleccionada y el `start_time` del slot con la fecha y hora actual (`new Date()`).
   
2. **Actualizar la validación de reservas (`canBook`)**:
   En el renderizado de horarios (`daySlots.map`) de `BookingPage.tsx`, instanciar esta nueva validación para cada turno:
   ```typescript
   const isSlotInPast = isPastSlot(selectedDate, slot.start_time);
   const canBook =
     !isPastDate(selectedDate) &&
     !isSlotInPast &&
     isAvailable &&
     (userProfile?.credits ?? 0) > 0 &&
     !isBooking &&
     !isBooked;
   ```

3. **Mejorar Feedback de UI para Slots Pasados**:
   - Cambiar el estilo visual del bloque del horario si `isSlotInPast` es verdadero (ej. añadir clase de opacidad reducida).
   - Actualizar el texto del botón cuando el horario ha pasado para que muestre un texto inactivo como "Horario pasado" y asegurar que esté deshabilitado (`disabled={true}`).

4. **Corregir y expandir Tests E2E en `booking.spec.ts`**:
   Modificar el test `BOOK-09: Slots pasados no son seleccionables` para que valide que los botones de reserva correspondientes a horarios pasados (tanto en días anteriores como dentro del día actual) efectivamente se encuentren deshabilitados y contengan el texto correcto en la interfaz.

## Criterios de Aceptación

<<<<<<< HEAD
- [ ] Los usuarios no pueden reservar slots cuyo horario de inicio ya pasó en el día actual.
- [ ] Los slots pasados se muestran visualmente deshabilitados en la interfaz (ej. opacidad reducida, texto "Horario pasado").
- [ ] Los tests E2E de Playwright (`BOOK-09`) validan correctamente que no se pueden seleccionar turnos pasados del día actual.
=======
- [x] Los usuarios no pueden reservar slots cuyo horario de inicio ya pasó en el día actual.
- [x] Los slots pasados se muestran visualmente deshabilitados en la interfaz (ej. opacidad reducida, texto "Horario pasado").
- [x] Los tests E2E de Playwright (`BOOK-09`) validan correctamente que no se pueden seleccionar turnos pasados del día actual.
>>>>>>> a933659a8856b770e646a2901d396fe34346d809

## Riesgos y Notas

- **Riesgos**: 
  - La zona horaria del cliente frente a la del servidor puede causar discrepancias si `new Date()` se evalúa solo en cliente. Hay que asegurar que la comparación considere la zona horaria correctamente de manera consistente con el resto de la app.
- **Notas de Paralelización**: 
<<<<<<< HEAD
  - Las modificaciones en `BookingPage.tsx` y `booking.spec.ts` se pueden realizar en paralelo si se acuerdan los selectores (ej. `button:disabled:has-text("Horario pasado")`).
=======
  - Las modificaciones en `BookingPage.tsx` y `booking.spec.ts` se pueden realizar en paralelo si se acuerdan los selectores (ej. `button:disabled:has-text("Horario pasado")`).
>>>>>>> a933659a8856b770e646a2901d396fe34346d809
