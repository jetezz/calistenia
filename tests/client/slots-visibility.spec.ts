/**
 * Test: Visibilidad de Horarios (Recurrentes y Específicos)
 *
 * Este test verifica que los horarios creados por el seeder sean visibles
 * correctamente en la página de reservas, navegando a la SIGUIENTE SEMANA
 * donde siempre estarán disponibles los slots de test.
 *
 * IMPORTANTE: Este test depende del global-setup.ts que crea:
 * - Un slot RECURRENTE para el día correspondiente a 7 días después
 * - Un slot ESPECÍFICO para exactamente 7 días después
 */

import { test, expect, loginAs } from "../fixtures/auth.fixtures";
import { TEST_SLOT_CONFIG } from "../setup/test-seeder";

// Convertir horario de formato HH:MM:SS a HH:MM para comparación en UI
const formatTimeForUI = (time: string): string => {
  return time.split(":").slice(0, 2).join(":");
};

test.describe("Visibilidad de Horarios (Recurrentes y Específicos)", () => {
  // Horarios esperados del seeder
  const recurringTimeStart = formatTimeForUI(
    TEST_SLOT_CONFIG.RECURRING.startTime,
  );
  const recurringTimeEnd = formatTimeForUI(TEST_SLOT_CONFIG.RECURRING.endTime);
  const specificTimeStart = formatTimeForUI(
    TEST_SLOT_CONFIG.SPECIFIC.startTime,
  );
  const specificTimeEnd = formatTimeForUI(TEST_SLOT_CONFIG.SPECIFIC.endTime);

  test("Debe mostrar correctamente horarios recurrentes y específicos al navegar a la siguiente semana", async ({
    page,
  }) => {
    // --- LOGIN COMO CLIENTE ---
    await loginAs(page, "client");

    // --- NAVEGAR A LA PÁGINA DE RESERVAS ---
    await page.goto("/app/book");
    await page.waitForLoadState("networkidle");

    // Esperar a que el calendario se cargue
    await page.waitForSelector("button", { state: "visible", timeout: 10000 });

    // --- NAVEGAR A LA SIGUIENTE SEMANA ---
    // Los slots de test siempre están configurados para 7 días después,
    // por lo que al ir a la siguiente semana siempre los encontraremos.
    console.log("📅 Navegando a la siguiente semana...");

    // El botón de siguiente usa el icono ChevronRight que está dentro de un botón
    // Buscamos el último botón del header de navegación (el segundo botón de navegación)
    const nextWeekButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-chevron-right") })
      .first();

    // Alternativa si el selector anterior no funciona
    const nextWeekButtonAlt = page
      .locator('button.h-8.w-8:has(svg), button[class*="h-8"][class*="w-8"]')
      .last();

    if (await nextWeekButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextWeekButton.click();
      console.log("✅ Navegado a la siguiente semana (usando ChevronRight)");
    } else if (
      await nextWeekButtonAlt.isVisible({ timeout: 2000 }).catch(() => false)
    ) {
      await nextWeekButtonAlt.click();
      console.log("✅ Navegado a la siguiente semana (usando selector alt)");
    } else {
      // Último recurso: buscar todos los botones pequeños y usar el último
      const navButtons = page.locator('button.h-8, button[class*="p-0"]');
      const count = await navButtons.count();
      if (count >= 2) {
        await navButtons.nth(count - 1).click();
        console.log("✅ Navegado a la siguiente semana (usando último botón)");
      }
    }

    await page.waitForTimeout(1000); // Esperar a que se carguen los slots

    // --- BUSCAR EL DÍA CON SLOTS ---
    // Hoy + 7 días es domingo (día 0), así que buscamos el botón que tenga "Dom"
    console.log("🔍 Buscando el día con los slots de test...");

    // Los días están en botones con el texto del día abreviado (Dom, Lun, etc.)
    // y el número del día. Necesitamos encontrar el día correcto.

    // Verificamos si el slot recurrente está visible
    // El formato mostrado es "HH:MM - HH:MM"
    const recurringSlotText = `${recurringTimeStart} - ${recurringTimeEnd}`;
    const specificSlotText = `${specificTimeStart} - ${specificTimeEnd}`;

    console.log(`🔍 Buscando slot recurrente: ${recurringSlotText}`);
    console.log(`🔍 Buscando slot específico: ${specificSlotText}`);

    // Primero, hagamos clic en cada día de la semana hasta encontrar los slots
    // Los días de la semana están en una grilla de 7 columnas
    const dayButtons = page.locator(".grid-cols-7 button");
    const dayCount = await dayButtons.count();

    console.log(`📊 Encontrados ${dayCount} botones de día`);

    let foundRecurring = false;
    let foundSpecific = false;

    for (let i = 0; i < dayCount; i++) {
      const dayBtn = dayButtons.nth(i);

      // Verificar si el botón está habilitado (no es día pasado)
      const isDisabled = await dayBtn.isDisabled();
      if (isDisabled) {
        continue;
      }

      await dayBtn.click();
      await page.waitForTimeout(300);

      // Verificar si los slots están visibles
      const recurringVisible = await page
        .locator(`text=${recurringSlotText}`)
        .isVisible({ timeout: 500 })
        .catch(() => false);

      const specificVisible = await page
        .locator(`text=${specificSlotText}`)
        .isVisible({ timeout: 500 })
        .catch(() => false);

      if (recurringVisible) {
        foundRecurring = true;
        console.log(
          `✅ Slot recurrente encontrado en día ${i + 1}: ${recurringSlotText}`,
        );
      }

      if (specificVisible) {
        foundSpecific = true;
        console.log(
          `✅ Slot específico encontrado en día ${i + 1}: ${specificSlotText}`,
        );
      }

      // Si encontramos ambos, podemos salir del loop
      if (foundRecurring && foundSpecific) {
        break;
      }
    }

    // Verificaciones finales
    expect(foundRecurring).toBe(true);
    expect(foundSpecific).toBe(true);

    console.log("🎉 Test completado exitosamente - ambos slots encontrados");
  });

  test("Ambos slots deben aparecer en el mismo día de la siguiente semana", async ({
    page,
  }) => {
    // --- LOGIN COMO CLIENTE ---
    await loginAs(page, "client");

    // --- NAVEGAR A LA PÁGINA DE RESERVAS ---
    await page.goto("/app/book");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // --- NAVEGAR A LA SIGUIENTE SEMANA ---
    const nextWeekButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-chevron-right") })
      .first();

    if (await nextWeekButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextWeekButton.click();
    } else {
      // Fallback: buscar el botón por posición
      const navButtons = page.locator(
        'button.h-8, button[class*="w-8"][class*="p-0"]',
      );
      const count = await navButtons.count();
      if (count >= 1) {
        await navButtons.last().click();
      }
    }

    await page.waitForTimeout(1000);

    // --- BUSCAR EL DÍA QUE TIENE AMBOS SLOTS ---
    const recurringSlotText = `${recurringTimeStart} - ${recurringTimeEnd}`;
    const specificSlotText = `${specificTimeStart} - ${specificTimeEnd}`;

    const dayButtons = page.locator(".grid-cols-7 button");
    const dayCount = await dayButtons.count();

    let foundBothInSameDay = false;
    let dayWithBothSlots = -1;

    for (let i = 0; i < dayCount; i++) {
      const dayBtn = dayButtons.nth(i);

      const isDisabled = await dayBtn.isDisabled();
      if (isDisabled) {
        continue;
      }

      await dayBtn.click();
      await page.waitForTimeout(400);

      // Verificar si AMBOS slots están visibles
      const hasRecurring = await page
        .locator(`text=${recurringSlotText}`)
        .isVisible({ timeout: 500 })
        .catch(() => false);

      const hasSpecific = await page
        .locator(`text=${specificSlotText}`)
        .isVisible({ timeout: 500 })
        .catch(() => false);

      if (hasRecurring && hasSpecific) {
        foundBothInSameDay = true;
        dayWithBothSlots = i + 1;
        console.log(`✅ Encontrados ambos slots en el día ${dayWithBothSlots}`);
        break;
      }
    }

    expect(foundBothInSameDay).toBe(true);
    console.log(
      `✅ Verificado: Ambos slots aparecen en el día ${dayWithBothSlots}`,
    );
  });
});
