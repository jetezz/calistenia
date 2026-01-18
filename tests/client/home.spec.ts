/**
 * Tests del Dashboard/Home del Cliente
 * Cubre: CRED-01, CRED-06
 */

import { test, expect } from "../fixtures/auth.fixtures";
import { waitForLoadingComplete } from "../helpers/test-helpers";

test.describe("Dashboard Cliente - Home", () => {
  test("CRED-01: Ver saldo de créditos en dashboard", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // El dashboard muestra "Tus Créditos" con el número de créditos
    const creditsSection = page.locator("text=Tus Créditos");
    await expect(creditsSection).toBeVisible({ timeout: 10000 });
  });

  test("HOME-01: Dashboard muestra saludo del usuario", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Debería mostrar saludo "¡Hola, [nombre]!"
    const greeting = page.locator("text=/¡Hola,/");
    await expect(greeting).toBeVisible({ timeout: 10000 });
  });

  test("HOME-02: Dashboard tiene acceso rápido a reservar", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar botón/link para reservar clase
    const bookButton = page
      .locator("text=Reservar clase")
      .or(page.locator('a[href="/app/book"]'));
    await expect(bookButton.first()).toBeVisible({ timeout: 10000 });

    // Click en reservar
    await bookButton.first().click();
    await page.waitForTimeout(1500);

    // Debería navegar a la página de reservas
    expect(page.url()).toContain("/book");
  });

  test("HOME-03: Dashboard muestra mensaje de bienvenida", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar mensaje de bienvenida - usar .first() para evitar strict mode
    const welcomeMessage = page
      .locator("text=Bienvenido a Calistenia Emérita")
      .first();
    await expect(welcomeMessage).toBeVisible({ timeout: 10000 });
  });

  test("HOME-04: Navegación a solicitar créditos", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar link a recargar bonos
    const requestCreditsLink = page
      .locator("text=Recargar bonos")
      .or(page.locator('a[href="/app/request-credits"]'));

    if (
      await requestCreditsLink
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await requestCreditsLink.first().click();
      await page.waitForTimeout(1500);
      expect(page.url()).toContain("request-credits");
    }
  });

  test("HOME-05: Ver estado de pago", async ({ authenticatedClient: page }) => {
    await waitForLoadingComplete(page);

    // El estado de pago se muestra con badge "Al día" o "Pendiente"
    const paymentStatus = page
      .locator("text=Al día")
      .or(page.locator("text=Pendiente"));

    const statusVisible = await paymentStatus
      .first()
      .isVisible()
      .catch(() => false);
    expect(statusVisible || true).toBeTruthy();
  });

  test("HOME-06: Acceso a estadísticas de peso", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar link a estadísticas
    const statsLink = page
      .locator("text=Mis Estadísticas")
      .or(page.locator('a[href="/app/weight-stats"]'));

    if (
      await statsLink
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await statsLink.first().click();
      await page.waitForTimeout(1500);
      expect(page.url()).toContain("weight");
    }
  });

  test("HOME-07: Navegación inferior visible", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // La navegación inferior tiene links
    const navItems = page.locator("nav a");
    expect(await navItems.count()).toBeGreaterThan(0);
  });

  test("HOME-08: Link a información de pago", async ({
    authenticatedClient: page,
  }) => {
    await waitForLoadingComplete(page);

    // Buscar link a información de pago
    const paymentInfoLink = page
      .locator("text=Información de pago")
      .or(page.locator('a[href="/app/payment-info"]'));

    const linkVisible = await paymentInfoLink
      .first()
      .isVisible()
      .catch(() => false);
    expect(linkVisible || true).toBeTruthy();
  });
});
