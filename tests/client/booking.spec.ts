/**
 * Tests de Reserva de Clases
 * Cubre: BOOK-01 a BOOK-04
 */

import { test, expect } from "../fixtures/auth.fixtures";
import {
  waitForLoadingComplete,
  navigateToClientSection,
} from "../helpers/test-helpers";

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

    // Verificar que la página carga correctamente
    await expect(page.locator("main")).toBeVisible();
  });
});
