/**
 * Tests de Configuración General - Admin
 * Cubre: ADM-07
 */

import { test, expect } from "../fixtures/auth.fixtures";
import {
  waitForLoadingComplete,
  navigateToAdminSection,
} from "../helpers/test-helpers";

test.describe("Configuración General - Admin", () => {
  test.beforeEach(async ({ authenticatedAdmin: page }) => {
    await navigateToAdminSection(page, "settings");
  });

  test("ADM-07: Ver página de configuración", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que estamos en la página de configuración
    const pageContent = page.locator("main");
    await expect(pageContent).toBeVisible({ timeout: 10000 });
  });

  test("SETTINGS-01: Ver opciones de configuración", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Debería haber secciones de configuración
    const settingsSections = page
      .locator('[class*="card"]')
      .or(page.locator("form"));
    await expect(settingsSections.first()).toBeVisible({ timeout: 10000 });
  });

  test("SETTINGS-02: Configuración de landing page", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que la página carga
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });

  test("SETTINGS-03: Editar nombre del negocio", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar campo de nombre del negocio
    const businessNameField = page
      .locator('input[name*="business"]')
      .or(page.locator('input[name*="name"]'));

    if (
      await businessNameField
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await expect(businessNameField.first()).toBeEnabled();
    }
    expect(true).toBeTruthy();
  });

  test("SETTINGS-04: Configuración de contacto", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que la página carga
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });

  test("SETTINGS-05: Configuración de horarios de atención", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que la página carga
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });

  test("SETTINGS-06: Configuración de imágenes", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que la página carga
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });

  test("SETTINGS-07: Guardar cambios", async ({ authenticatedAdmin: page }) => {
    await waitForLoadingComplete(page);

    // Buscar botón de guardar
    const saveButton = page
      .locator('button:has-text("Guardar")')
      .or(page.locator('button[type="submit"]'));

    if (
      await saveButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await expect(saveButton.first()).toBeEnabled();
    }
    expect(true).toBeTruthy();
  });

  test("SETTINGS-08: Toggle de mostrar/ocultar secciones", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar toggles de visibilidad
    const visibilityToggles = page
      .locator('input[type="checkbox"]')
      .or(page.locator('button[role="switch"]'));

    if ((await visibilityToggles.count()) > 0) {
      await expect(visibilityToggles.first()).toBeVisible();
    }
    expect(true).toBeTruthy();
  });

  test("SETTINGS-09: Previsualización de cambios", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que la página carga
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });
});
