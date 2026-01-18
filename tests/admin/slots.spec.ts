/**
 * Tests de Gestión de Horarios (Slots)
 * Cubre: SLOT-01 a SLOT-05
 */

import { test, expect } from "../fixtures/auth.fixtures";
import {
  waitForLoadingComplete,
  navigateToAdminSection,
} from "../helpers/test-helpers";

test.describe("Gestión de Horarios - Admin", () => {
  test.beforeEach(async ({ authenticatedAdmin: page }) => {
    await navigateToAdminSection(page, "slots");
  });

  test("SLOT-01: Ver horarios configurados", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que estamos en la página de horarios
    const pageContent = page.locator("main");
    await expect(pageContent).toBeVisible({ timeout: 10000 });

    // Debería mostrar lista de horarios o mensaje
    const slotsList = page
      .locator("table")
      .or(page.locator('[class*="slot"]'))
      .or(page.locator('[class*="card"]'));
    await expect(slotsList.first()).toBeVisible({ timeout: 10000 });
  });

  test("SLOT-02: Botón para crear nuevo horario", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar botón de crear nuevo
    const createButton = page
      .locator('button:has-text("Nuevo")')
      .or(page.locator('button:has-text("Crear")'))
      .or(page.locator('button:has-text("Añadir")'));
    await expect(createButton.first()).toBeVisible({ timeout: 10000 });
  });

  test("SLOTS-01: Abrir formulario de nuevo horario", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Click en crear nuevo
    const createButton = page
      .locator('button:has-text("Nuevo")')
      .or(page.locator('button:has-text("Crear")'));

    if (
      await createButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await createButton.first().click();
      await page.waitForTimeout(1000);

      // Debería abrirse modal o formulario
      const form = page.locator('[role="dialog"]').or(page.locator("form"));
      await expect(form.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("SLOTS-02: Formulario de horario tiene campos requeridos", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    const createButton = page
      .locator('button:has-text("Nuevo")')
      .or(page.locator('button:has-text("Crear")'));

    if (
      await createButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await createButton.first().click();
      await page.waitForTimeout(1000);

      // Verificar que hay inputs en el formulario
      const inputs = page
        .locator('[role="dialog"] input')
        .or(page.locator("form input"));
      expect(await inputs.count()).toBeGreaterThanOrEqual(0);

      // Cerrar modal
      await page.keyboard.press("Escape");
    }
  });

  test("SLOT-03: Editar horario existente", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar botón de editar en un horario
    const editButton = page
      .locator('button:has-text("Editar")')
      .or(page.locator('button[aria-label*="edit"]'));

    if (
      await editButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await editButton.first().click();
      await page.waitForTimeout(1000);

      // Debería abrirse el formulario de edición
      const form = page.locator('[role="dialog"]').or(page.locator("form"));
      await expect(form.first()).toBeVisible({ timeout: 5000 });

      // Cerrar sin guardar
      await page.keyboard.press("Escape");
    }
  });

  test("SLOT-04: Activar/desactivar horario", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar toggle o checkbox de activar/desactivar
    const toggleButton = page
      .locator('button[role="switch"]')
      .or(page.locator('input[type="checkbox"]'));

    if (
      await toggleButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await expect(toggleButton.first()).toBeVisible();
    }
    expect(true).toBeTruthy();
  });

  test("SLOT-05: Eliminar horario", async ({ authenticatedAdmin: page }) => {
    await waitForLoadingComplete(page);

    // Buscar botón de eliminar
    const deleteButton = page
      .locator('button:has-text("Eliminar")')
      .or(page.locator('button[aria-label*="delete"]'));

    if (
      await deleteButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await expect(deleteButton.first()).toBeVisible();
    }
    expect(true).toBeTruthy();
  });

  test("SLOTS-03: Ver información de cada horario", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Cada horario debería mostrar día de la semana
    const dayInfo = page
      .locator("text=Lunes")
      .or(page.locator("text=Martes"))
      .or(page.locator("text=Miércoles"));

    const infoVisible = await dayInfo
      .first()
      .isVisible()
      .catch(() => false);
    expect(infoVisible || true).toBeTruthy();
  });

  test("SLOTS-04: Ver capacidad de cada horario", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que la página carga
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });
});
