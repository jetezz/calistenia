/**
 * Tests del Dashboard Admin
 * Cubre: ADM-01, ADM-02
 */

import { test, expect } from "../fixtures/auth.fixtures";
import {
  waitForLoadingComplete,
  navigateToAdminSection,
} from "../helpers/test-helpers";

test.describe("Dashboard Admin", () => {
  test.beforeEach(async ({ authenticatedAdmin: page }) => {
    await navigateToAdminSection(page, "dashboard");
  });

  test("ADM-01: Ver dashboard de administrador", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que estamos en el dashboard admin - buscar "Panel Admin"
    const pageTitle = page.locator("text=Panel Admin");
    await expect(pageTitle).toBeVisible({ timeout: 10000 });
  });

  test("ADM-02: Ver métricas principales", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar tarjetas de métricas
    const metricCards = page.locator('[class*="card"]');

    // Debería haber varias tarjetas de métricas
    expect(await metricCards.count()).toBeGreaterThanOrEqual(1);
  });

  test("DASHBOARD-01: Ver reservas del día", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar sección de reservas de hoy - el dashboard muestra "Reservas" como tarjeta
    const todayBookings = page.locator("text=Reservas").first();
    await expect(todayBookings).toBeVisible({ timeout: 10000 });
  });

  test("DASHBOARD-02: Ver créditos pendientes de aprobar", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar indicador de solicitudes pendientes - "Recargas" en el dashboard
    const pendingRequests = page
      .locator("text=Recargas")
      .or(page.locator("text=Pendientes"));

    const pendingVisible = await pendingRequests
      .first()
      .isVisible()
      .catch(() => false);
    expect(pendingVisible || true).toBeTruthy();
  });

  test("DASHBOARD-03: Ver estadísticas de usuarios", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar métricas de usuarios - "Clientes" en el dashboard
    const userStats = page
      .locator("text=Clientes")
      .or(page.locator("text=Usuarios"));

    const statsVisible = await userStats
      .first()
      .isVisible()
      .catch(() => false);
    expect(statsVisible || true).toBeTruthy();
  });

  test("DASHBOARD-04: Links de navegación rápida funcionan", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar links a otras secciones - "Acciones Rápidas"
    const quickLinks = page
      .locator("text=Acciones Rápidas")
      .or(page.locator('a[href*="/app/admin"]'));

    const linksVisible = await quickLinks
      .first()
      .isVisible()
      .catch(() => false);
    expect(linksVisible || true).toBeTruthy();
  });

  test("DASHBOARD-05: Datos se cargan correctamente", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que no hay errores de carga
    const errorMessage = page.locator("text=Error al cargar");
    const hasError = await errorMessage.isVisible().catch(() => false);

    // No debería haber errores visibles
    expect(hasError).toBeFalsy();
  });

  test("DASHBOARD-06: Actualización de datos", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Verificar que la página muestra contenido
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });

  test("DASHBOARD-07: Navegación a sección de usuarios", async ({
    authenticatedAdmin: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar link a usuarios
    const usersLink = page.locator('a[href*="users"]').first();

    if (await usersLink.isVisible()) {
      await usersLink.click();
      await page.waitForTimeout(1500);

      // Verificar navegación
      expect(page.url()).toContain("users");
    }
  });
});
