/**
 * Test: Visibilidad de Horarios (Recurrentes y Específicos)
 *
 * Este test verifica que los horarios creados por el seeder sean visibles
 * correctamente en la página de reservas, navegando a la SIGUIENTE SEMANA.
 *
 * IMPORTANTE: Este test depende del global-setup.ts que crea:
 * - Un slot RECURRENTE para SÁBADO (día 6)
 * - Un slot ESPECÍFICO para el DOMINGO de la siguiente semana
 *
 * Los slots están en días DIFERENTES para poder verificar que el punto verde
 * de disponibilidad aparece correctamente en ambos casos.
 */

import { test, expect, loginAs } from "../fixtures/auth.fixtures";
import { TEST_SLOT_CONFIG, RECURRING_DAY_OF_WEEK } from "../setup/test-seeder";

// Convertir horario de formato HH:MM:SS a HH:MM para comparación en UI
const formatTimeForUI = (time: string): string => {
  return time.split(":").slice(0, 2).join(":");
};

// Mapeo de días de la semana
const DAY_NAMES: Record<number, string> = {
  0: "Dom",
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
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

  // Días esperados
  const recurringDayName = DAY_NAMES[RECURRING_DAY_OF_WEEK]; // "Sáb"
  const specificDayName = DAY_NAMES[0]; // "Dom" (siempre domingo)

  test("Debe mostrar el slot recurrente en Sábado", async ({ page }) => {
    // --- LOGIN COMO CLIENTE ---
    await loginAs(page, "client");

    // --- NAVEGAR A LA PÁGINA DE RESERVAS ---
    await page.goto("/app/book");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // --- NAVEGAR A LA SIGUIENTE SEMANA ---
    console.log("📅 Navegando a la siguiente semana...");

    const nextWeekButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-chevron-right") })
      .first();

    if (await nextWeekButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextWeekButton.click();
      console.log("✅ Navegado a la siguiente semana");
    } else {
      const navButtons = page.locator('button.h-8, button[class*="p-0"]');
      const count = await navButtons.count();
      if (count >= 1) {
        await navButtons.last().click();
      }
    }

    await page.waitForTimeout(1000);

    // --- BUSCAR EL SÁBADO ---
    console.log(`🔍 Buscando el Sábado (${recurringDayName})...`);

    const recurringSlotText = `${recurringTimeStart} - ${recurringTimeEnd}`;
    const dayButtons = page.locator(".grid-cols-7 button");
    const dayCount = await dayButtons.count();

    let foundRecurring = false;

    for (let i = 0; i < dayCount; i++) {
      const dayBtn = dayButtons.nth(i);
      const dayText = await dayBtn.textContent();

      // Buscar el botón que contiene "Sáb"
      if (dayText?.includes(recurringDayName)) {
        const isDisabled = await dayBtn.isDisabled();
        if (!isDisabled) {
          await dayBtn.click();
          await page.waitForTimeout(500);

          // Verificar si el slot recurrente está visible
          const recurringVisible = await page
            .locator(`text=${recurringSlotText}`)
            .isVisible({ timeout: 2000 })
            .catch(() => false);

          if (recurringVisible) {
            foundRecurring = true;
            console.log(
              `✅ Slot recurrente encontrado en ${recurringDayName}: ${recurringSlotText}`,
            );
          }
          break;
        }
      }
    }

    expect(foundRecurring).toBe(true);
    console.log("🎉 Test de slot recurrente completado");
  });

  test("Debe mostrar el slot específico en Domingo", async ({ page }) => {
    // --- LOGIN COMO CLIENTE ---
    await loginAs(page, "client");

    // --- NAVEGAR A LA PÁGINA DE RESERVAS ---
    await page.goto("/app/book");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // --- NAVEGAR A LA SIGUIENTE SEMANA ---
    console.log("📅 Navegando a la siguiente semana...");

    const nextWeekButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-chevron-right") })
      .first();

    if (await nextWeekButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextWeekButton.click();
      console.log("✅ Navegado a la siguiente semana");
    } else {
      const navButtons = page.locator('button.h-8, button[class*="p-0"]');
      const count = await navButtons.count();
      if (count >= 1) {
        await navButtons.last().click();
      }
    }

    await page.waitForTimeout(1000);

    // --- BUSCAR EL DOMINGO ---
    console.log(`🔍 Buscando el Domingo (${specificDayName})...`);

    const specificSlotText = `${specificTimeStart} - ${specificTimeEnd}`;
    const dayButtons = page.locator(".grid-cols-7 button");
    const dayCount = await dayButtons.count();

    let foundSpecific = false;

    for (let i = 0; i < dayCount; i++) {
      const dayBtn = dayButtons.nth(i);
      const dayText = await dayBtn.textContent();

      // Buscar el botón que contiene "Dom"
      if (dayText?.includes(specificDayName)) {
        const isDisabled = await dayBtn.isDisabled();
        if (!isDisabled) {
          await dayBtn.click();
          await page.waitForTimeout(500);

          // Verificar si el slot específico está visible
          const specificVisible = await page
            .locator(`text=${specificSlotText}`)
            .isVisible({ timeout: 2000 })
            .catch(() => false);

          if (specificVisible) {
            foundSpecific = true;
            console.log(
              `✅ Slot específico encontrado en ${specificDayName}: ${specificSlotText}`,
            );
          }
          break;
        }
      }
    }

    expect(foundSpecific).toBe(true);
    console.log("🎉 Test de slot específico completado");
  });

  test("Los slots deben estar en días diferentes (Sábado y Domingo)", async ({
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
      const navButtons = page.locator('button.h-8, button[class*="p-0"]');
      const count = await navButtons.count();
      if (count >= 1) {
        await navButtons.last().click();
      }
    }

    await page.waitForTimeout(1000);

    const recurringSlotText = `${recurringTimeStart} - ${recurringTimeEnd}`;
    const specificSlotText = `${specificTimeStart} - ${specificTimeEnd}`;
    const dayButtons = page.locator(".grid-cols-7 button");
    const dayCount = await dayButtons.count();

    let saturdayHasRecurring = false;
    let sundayHasSpecific = false;
    let saturdayHasNoSpecific = true;
    let sundayHasNoRecurring = true;

    for (let i = 0; i < dayCount; i++) {
      const dayBtn = dayButtons.nth(i);
      const dayText = await dayBtn.textContent();
      const isDisabled = await dayBtn.isDisabled();

      if (isDisabled) continue;

      await dayBtn.click();
      await page.waitForTimeout(400);

      const hasRecurring = await page
        .locator(`text=${recurringSlotText}`)
        .isVisible({ timeout: 500 })
        .catch(() => false);

      const hasSpecific = await page
        .locator(`text=${specificSlotText}`)
        .isVisible({ timeout: 500 })
        .catch(() => false);

      if (dayText?.includes("Sáb")) {
        saturdayHasRecurring = hasRecurring;
        saturdayHasNoSpecific = !hasSpecific;
        console.log(
          `📅 Sábado: Recurrente=${hasRecurring}, Específico=${hasSpecific}`,
        );
      }

      if (dayText?.includes("Dom")) {
        sundayHasSpecific = hasSpecific;
        sundayHasNoRecurring = !hasRecurring;
        console.log(
          `📅 Domingo: Recurrente=${hasRecurring}, Específico=${hasSpecific}`,
        );
      }
    }

    // Verificaciones
    expect(saturdayHasRecurring).toBe(true);
    expect(sundayHasSpecific).toBe(true);
    expect(saturdayHasNoSpecific).toBe(true);
    expect(sundayHasNoRecurring).toBe(true);

    console.log("✅ Verificado: Los slots están en días diferentes");
    console.log("   - Sábado: Solo slot recurrente");
    console.log("   - Domingo: Solo slot específico");
  });
});
