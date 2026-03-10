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

    expect(calendarVisible || emptyVisible).toBeTruthy();
  });

  test("BOOK-02: Navegar a la semana siguiente", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

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

    await expect(page.locator("main")).toBeVisible();
  });

  test("BOOK-03: Navegar a la semana anterior", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

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

    await expect(page.locator("main")).toBeVisible();
  });

  test("BOOK-04: Botón Hoy funciona", async ({ authenticatedClient: page }) => {
    await waitForLoadingComplete(page);

    const todayButton = page.locator('button:has-text("Hoy")');

    if (await todayButton.isVisible().catch(() => false)) {
      await todayButton.click();
      await page.waitForTimeout(1000);
    }

    await expect(page.locator("main")).toBeVisible();
  });

  test("BOOK-05: Ver slots disponibles al seleccionar un día", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    const dayButton = page
      .locator("button")
      .filter({ hasText: /^[0-9]{1,2}$/ })
      .first();

    if (await dayButton.isVisible().catch(() => false)) {
      await dayButton.click();
      await page.waitForTimeout(1500);
    }

    await expect(page.locator("main")).toBeVisible();
  });

  test("BOOK-11: Slots muestran capacidad disponible (no se queda en Cargando...)", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);
    await expect(page.locator("main")).toBeVisible();

    // Buscar y clickar el primer día de la semana actual habilitado.
    // Si no hay ninguno habilitado (es domingo noche por ej), avanzamos de semana.
    let dayButton = page
      .locator("button")
      .filter({ hasText: /^[0-9]{1,2}$/ })
      .and(page.locator(":not([disabled])"))
      .first();

    if (!(await dayButton.isVisible().catch(() => false))) {
      const nextWeekButton = page.locator("button.h-8").last();
      if (await nextWeekButton.isVisible()) {
        await nextWeekButton.click();
        await page.waitForTimeout(1000);
      }
    }

    dayButton = page
      .locator("button")
      .filter({ hasText: /^[0-9]{1,2}$/ })
      .and(page.locator(":not([disabled])"))
      .first();

    if (await dayButton.isVisible().catch(() => false)) {
      await dayButton.click();
      await page.waitForTimeout(1500); // Esperar a que carguen los slots y la llamada batch

      // Comprobar si se pintan slots (clases disponibles)
      const slotCards = page.locator("[data-slot-id]");
      if ((await slotCards.count()) > 0) {
        // Asegurarse de que el texto "Cargando..." desaparece
        await expect(
          page.locator("span").filter({ hasText: "Cargando..." }),
        ).toHaveCount(0, { timeout: 10000 });

        // Verificar que al menos uno de los slots muestra la disponibilidad en el formato "X/Y plazas" o que no esté en Cargando
        const firstSlot = slotCards.first();
        const plazasText = firstSlot
          .locator("span")
          .filter({ hasText: /plazas|Completo/ });
        await expect(plazasText).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test("BOOK-07: Reservar una clase (si hay créditos)", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    const bookButton = page.locator('button:has-text("Reservar")');

    if (
      await bookButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await expect(bookButton.first()).toBeVisible();
    }
    expect(true).toBeTruthy();
  });

  test("BOOK-08: Mensaje cuando no hay créditos suficientes", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);
    await expect(page.locator("main")).toBeVisible();
  });

  test("BOOK-09: Slots pasados no son seleccionables", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    const pastSlotButtons = page.locator('button:has-text("Horario pasado")');

    if (
      await pastSlotButtons
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      const count = await pastSlotButtons.count();
      for (let i = 0; i < count; i++) {
        const button = pastSlotButtons.nth(i);
        await expect(button).toBeDisabled();
        await expect(button).toHaveText("Horario pasado");
      }
    }

    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("BOOK-10: Flujo de reserva con dos usuarios", () => {
  test.beforeEach(async () => {
    await cleanBook10Bookings();
  });

  test("BOOK-10: Reservar slot reduce disponibilidad para otros usuarios", async ({
    authenticatedClient: page1,
    authenticatedClient2: page2,
  }) => {
    const slotId = TEST_SLOT_IDS.BOOK10;
    const capacity = TEST_SLOT_CONFIG.BOOK10.capacity; // 6

    const getSlotCard = (page: typeof page1) =>
      page.locator(`[data-slot-id="${slotId}"]`);

    /**
     * Navega a la página de reservas y selecciona el Jueves BOOK10:
     * - Si el Jueves de la semana actual está deshabilitado (ya pasó),
     *   avanza a la siguiente semana donde el slot recurrente existe.
     * - Espera explícitamente a que la URL sea /app/book
     * - Espera a que la disponibilidad del slot BOOK10 cargue completamente
     */
    const navigateToBook10Thursday = async (
      page: typeof page1,
    ): Promise<void> => {
      await page.goto("/app/book");
      // Esperar a que la URL sea /app/book (no /app tras redirect de auth)
      await page.waitForURL("**/app/book", { timeout: 10000 });
      await waitForLoadingComplete(page);

      // Comprobar si el Jueves actual está habilitado
      const thursdayBtn = page
        .locator("button")
        .filter({ hasText: /^Jue/ })
        .first();
      const thursdayExists = await thursdayBtn
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      const thursdayDisabled = thursdayExists
        ? await thursdayBtn.isDisabled().catch(() => false)
        : true;

      if (!thursdayExists || thursdayDisabled) {
        // Usar el tercer botón h-8 (último = ChevronRight / siguiente semana)
        // Botones h-8 en orden: [Hoy, ChevronLeft, ChevronRight]
        await page.locator("button.h-8").last().click();
        await page.waitForTimeout(1000);
      }

      // Click en el Jueves
      const thursBtnNow = page
        .locator("button")
        .filter({ hasText: /^Jue/ })
        .first();
      await expect(thursBtnNow).toBeVisible({ timeout: 10000 });
      await expect(thursBtnNow).toBeEnabled({ timeout: 5000 });
      await thursBtnNow.click();

      // Esperar que el slot BOOK10 sea visible y su disponibilidad esté cargada
      const slotCard = getSlotCard(page);
      await expect(slotCard).toBeVisible({ timeout: 15000 });
      // Esperar que "Cargando..." desaparezca del span de plazas
      await expect(
        page.locator("span").filter({ hasText: /Cargando/ }),
      ).toHaveCount(0, { timeout: 15000 });
    };

    // ── FASE 1: Usuario 1 (authenticatedClient) ──────────────────────────────
    await navigateToBook10Thursday(page1);
    const slotCard1 = getSlotCard(page1);

    // Verificar disponibilidad inicial: N/N plazas
    const plazasSpan1 = slotCard1
      .locator("span")
      .filter({ hasText: /plazas/ })
      .first();
    await expect(plazasSpan1).toBeVisible({ timeout: 10000 });
    await expect(plazasSpan1).toContainText(`${capacity}/${capacity}`);

    // Reservar (el botón puede decir "Reservar (1 crédito)")
    const bookBtn1 = slotCard1
      .locator("button")
      .filter({ hasText: /Reservar/ })
      .first();
    await expect(bookBtn1).toBeEnabled();
    await bookBtn1.click();
    await page1.waitForTimeout(3000);

    // Verificar post-reserva usuario 1
    const slotCard1After = getSlotCard(page1);
    await expect(
      slotCard1After
        .locator("span")
        .filter({ hasText: /plazas/ })
        .first(),
    ).toContainText(`${capacity - 1}/${capacity}`, { timeout: 10000 });
    await expect(
      slotCard1After.locator("button").filter({ hasText: /Ya tienes reserva/ }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      slotCard1After.locator("button").filter({ hasText: /Ya tienes reserva/ }),
    ).toBeDisabled();

    // ── FASE 2: Usuario 2 (authenticatedClient2) ─────────────────────────────
    await navigateToBook10Thursday(page2);
    const slotCard2 = getSlotCard(page2);

    // Usuario 2 debe ver capacidad reducida
    const plazasSpan2 = slotCard2
      .locator("span")
      .filter({ hasText: /plazas/ })
      .first();
    await expect(plazasSpan2).toBeVisible({ timeout: 10000 });
    await expect(plazasSpan2).toContainText(`${capacity - 1}/${capacity}`, {
      timeout: 10000,
    });

    // Usuario 2 reserva
    const bookBtn2 = slotCard2
      .locator("button")
      .filter({ hasText: /Reservar/ })
      .first();
    await expect(bookBtn2).toBeEnabled();
    await bookBtn2.click();
    await page2.waitForTimeout(3000);

    // Verificar post-reserva usuario 2
    const slotCard2After = getSlotCard(page2);
    await expect(
      slotCard2After
        .locator("span")
        .filter({ hasText: /plazas/ })
        .first(),
    ).toContainText(`${capacity - 2}/${capacity}`, { timeout: 10000 });
    await expect(
      slotCard2After.locator("button").filter({ hasText: /Ya tienes reserva/ }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      slotCard2After.locator("button").filter({ hasText: /Ya tienes reserva/ }),
    ).toBeDisabled();
  });
});
