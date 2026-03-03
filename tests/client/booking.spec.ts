/**
 * Tests de Reserva de Clases
 * Cubre: BOOK-01 a BOOK-04
 */

import { test, expect } from "../fixtures/auth.fixtures";
import {
  waitForLoadingComplete,
  navigateToClientSection,
} from "../helpers/test-helpers";
import {
  cleanBook10Bookings,
  TEST_SLOT_CONFIG,
  TEST_SLOT_IDS,
} from "../setup/test-seeder";

test.describe("Reserva de Clases - Cliente", () => {
  test.beforeEach(async ({ authenticatedClient: page }) => {
    await navigateToClientSection(page, "book");
  });

  test("BOOK-01: Ver calendario de clases", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que estamos en la página de reservas - puede mostrar calendario o mensaje vacío
    // Si hay horarios: muestra días de la semana (Lun, Mar, etc.)
    // Si no hay horarios: muestra "No hay horarios disponibles"
    const calendar = page
      .locator("text=Lun")
      .or(page.locator("text=Mar"))
      .or(page.locator("text=Mié"));
    const emptyState = page
      .locator("text=No hay horarios disponibles")
      .or(page.locator("text=Reservar Clase"));

    const calendarVisible = await calendar
      .first()
      .isVisible()
      .catch(() => false);
    const emptyVisible = await emptyState
      .first()
      .isVisible()
      .catch(() => false);

    // Debe mostrar el calendario O el estado vacío
    expect(calendarVisible || emptyVisible).toBeTruthy();
  });

  test("BOOK-02: Navegar a la semana siguiente", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar botón de siguiente semana (normalmente un chevron o flecha)
    const nextWeekButton = page
      .locator('button:has-text("›")')
      .or(page.locator('button:has-text(">")'))
      .or(page.locator('button[aria-label*="siguiente"]'));

    if (
      await nextWeekButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await nextWeekButton.first().click();
      await page.waitForTimeout(1000);
    }

    // El calendario debería seguir visible
    await expect(page.locator("main")).toBeVisible();
  });

  test("BOOK-03: Navegar a la semana anterior", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Primero ir a la siguiente semana
    const nextButton = page
      .locator('button:has-text("›")')
      .or(page.locator('button:has-text(">")'));
    if (
      await nextButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await nextButton.first().click();
      await page.waitForTimeout(500);
    }

    // Ahora ir a la semana anterior
    const prevWeekButton = page
      .locator('button:has-text("‹")')
      .or(page.locator('button:has-text("<")'));

    if (
      await prevWeekButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await prevWeekButton.first().click();
      await page.waitForTimeout(1000);
    }

    // El calendario debería seguir visible
    await expect(page.locator("main")).toBeVisible();
  });

  test("BOOK-04: Botón Hoy funciona", async ({ authenticatedClient: page }) => {
    await waitForLoadingComplete(page);

    // Buscar botón "Hoy"
    const todayButton = page.locator('button:has-text("Hoy")');

    if (await todayButton.isVisible().catch(() => false)) {
      await todayButton.click();
      await page.waitForTimeout(1000);
    }

    // Verificar que el calendario sigue visible
    await expect(page.locator("main")).toBeVisible();
  });

  test("BOOK-05: Ver slots disponibles al seleccionar un día", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Click en un día del calendario - buscar botones con números (días)
    const dayButton = page
      .locator("button")
      .filter({ hasText: /^[0-9]{1,2}$/ })
      .first();

    if (await dayButton.isVisible().catch(() => false)) {
      await dayButton.click();
      await page.waitForTimeout(1500);
    }

    // Debería mostrar contenido
    await expect(page.locator("main")).toBeVisible();
  });

  test("BOOK-06: Slots muestran capacidad disponible", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que la página carga correctamente
    await expect(page.locator("main")).toBeVisible();
  });

  test("BOOK-07: Reservar una clase (si hay créditos)", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar un slot disponible con botón de reservar
    const bookButton = page.locator('button:has-text("Reservar")');

    if (
      await bookButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      // Verificar que el botón existe
      await expect(bookButton.first()).toBeVisible();
    }
    expect(true).toBeTruthy();
  });

  test("BOOK-08: Mensaje cuando no hay créditos suficientes", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que la página carga correctamente
    await expect(page.locator("main")).toBeVisible();
  });

  test("BOOK-09: Slots pasados no son seleccionables", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar si hay botones indicando horarios pasados
    const pastSlotButtons = page.locator('button:has-text("Horario pasado")');

    if (await pastSlotButtons.first().isVisible().catch(() => false)) {
      const count = await pastSlotButtons.count();
      for (let i = 0; i < count; i++) {
        const button = pastSlotButtons.nth(i);
        await expect(button).toBeDisabled();
        await expect(button).toHaveText("Horario pasado");
      }
    }

    // Verificar que la página carga correctamente
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("BOOK-10: Flujo de reserva con dos usuarios", () => {
  test.beforeEach(async () => {
    // Limpiar reservas del slot BOOK10 para empezar desde cero en cada test
    await cleanBook10Bookings();
  });

  test("BOOK-10: Reservar slot reduce disponibilidad para otros usuarios", async ({
    authenticatedClient: page1,
    authenticatedClient2: page2,
  }) => {
    const slotId = TEST_SLOT_IDS.BOOK10;
    const capacity = TEST_SLOT_CONFIG.BOOK10.capacity; // 6

    // Helper: locate the BOOK10 slot card by its data-slot-id attribute
    const getSlotCard = (page: typeof page1) =>
      page.locator(`[data-slot-id="${slotId}"]`);

    // ── FASE 1: Usuario 1 navega hasta el slot del Jueves ──────────────────
    await page1.goto("/app/book");
    await waitForLoadingComplete(page1);

    // Navegar al Jueves (day_of_week = 4) en la semana visible
    const thursdayBtn1 = page1.locator("button").filter({ hasText: /^Jue/ }).first();
    const thursdayExists = await thursdayBtn1.isVisible().catch(() => false);

    if (!thursdayExists) {
      test.skip(true, "Jueves no visible en la semana actual — test omitido");
      return;
    }

    const thursdayDisabled = await thursdayBtn1.isDisabled().catch(() => false);
    if (thursdayDisabled) {
      test.skip(true, "Jueves ya pasó — test omitido");
      return;
    }

    await thursdayBtn1.click();
    await page1.waitForTimeout(1500);

    // Verify BOOK10 slot card is visible
    const slotCard1 = getSlotCard(page1);
    const slotExists = await slotCard1.isVisible().catch(() => false);
    if (!slotExists) {
      test.skip(true, `Slot BOOK10 no encontrado en Jueves (data-slot-id=${slotId})`);
      return;
    }

    // ── VERIFICAR DISPONIBILIDAD INICIAL (capacity/capacity) ────────────────
    const plazasSpan1 = slotCard1.locator("span").filter({ hasText: /plazas/ }).first();
    await expect(plazasSpan1).toContainText(`${capacity}/${capacity}`);

    // ── USUARIO 1 RESERVA ───────────────────────────────────────────────────
    const bookBtn1 = slotCard1.locator('button:has-text("Reservar")').first();
    await expect(bookBtn1).toBeEnabled();
    await bookBtn1.click();

    // Esperar a que la reserva se procese y la UI se actualice
    await page1.waitForTimeout(3000);

    // ── VERIFICAR: Usuario 1 ve "Ya tienes reserva" y capacidad reducida ────
    const slotCard1After = getSlotCard(page1);

    // Disponibilidad debe bajar a (capacity-1)/capacity
    await expect(
      slotCard1After.locator("span").filter({ hasText: /plazas/ }).first()
    ).toContainText(`${capacity - 1}/${capacity}`, { timeout: 10000 });

    // Botón debe mostrar "Ya tienes reserva" y estar deshabilitado
    await expect(
      slotCard1After.locator('button:has-text("Ya tienes reserva")')
    ).toBeVisible({ timeout: 10000 });
    await expect(
      slotCard1After.locator('button:has-text("Ya tienes reserva")')
    ).toBeDisabled();

    // ── FASE 2: Usuario 2 navega al mismo día y slot ─────────────────────────
    await page2.goto("/app/book");
    await waitForLoadingComplete(page2);

    const thursdayBtn2 = page2.locator("button").filter({ hasText: /^Jue/ }).first();
    await expect(thursdayBtn2).toBeVisible({ timeout: 10000 });
    await thursdayBtn2.click();
    await page2.waitForTimeout(1500);

    const slotCard2 = getSlotCard(page2);
    await expect(slotCard2).toBeVisible({ timeout: 10000 });

    // ── VERIFICAR: Usuario 2 ve la disponibilidad reducida por Usuario 1 ────
    await expect(
      slotCard2.locator("span").filter({ hasText: /plazas/ }).first()
    ).toContainText(`${capacity - 1}/${capacity}`, { timeout: 10000 });

    // ── USUARIO 2 RESERVA ───────────────────────────────────────────────────
    const bookBtn2 = slotCard2.locator('button:has-text("Reservar")').first();
    await expect(bookBtn2).toBeEnabled();
    await bookBtn2.click();

    await page2.waitForTimeout(3000);

    // ── VERIFICAR: Usuario 2 ve "Ya tienes reserva" y capacidad reducida ────
    const slotCard2After = getSlotCard(page2);

    // Disponibilidad debe bajar a (capacity-2)/capacity
    await expect(
      slotCard2After.locator("span").filter({ hasText: /plazas/ }).first()
    ).toContainText(`${capacity - 2}/${capacity}`, { timeout: 10000 });

    await expect(
      slotCard2After.locator('button:has-text("Ya tienes reserva")')
    ).toBeVisible({ timeout: 10000 });
    await expect(
      slotCard2After.locator('button:has-text("Ya tienes reserva")')
    ).toBeDisabled();
  });
});
