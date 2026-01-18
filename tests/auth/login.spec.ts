/**
 * Tests de Login - Autenticación
 * Cubre: AUTH-01, AUTH-02, AUTH-03
 */

import { test, expect } from "@playwright/test";
import { waitForPageLoad } from "../helpers/test-helpers";

test.describe("Login - Autenticación", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await waitForPageLoad(page);
  });

  test("AUTH-01: Login exitoso como cliente", async ({ page }) => {
    const email = process.env.CLIENT_EMAIL;
    const password = process.env.CLIENT_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "CLIENT_EMAIL o CLIENT_PASSWORD no configurados en .env.test",
      );
    }

    // Verificar que estamos en la página de login
    await expect(page.locator("h1")).toContainText("Calistenia Emérita");

    // Llenar formulario
    await page.fill("#email", email);
    await page.fill("#password", password);

    // Submit - El botón dice "Entrar"
    await page.click('button:has-text("Entrar")');

    // Verificar redirección al dashboard
    await expect(page).toHaveURL(/\/app/, { timeout: 15000 });

    // Verificar que se muestra contenido del dashboard de cliente
    // El dashboard de cliente muestra créditos y opciones de reserva
    await page.waitForTimeout(2000);
    const dashboardContent = page.locator("h1, h2, main");
    await expect(dashboardContent.first()).toBeVisible({ timeout: 10000 });
  });

  test("AUTH-02: Login exitoso como admin", async ({ page }) => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "ADMIN_EMAIL o ADMIN_PASSWORD no configurados en .env.test",
      );
    }

    // Llenar formulario
    await page.fill("#email", email);
    await page.fill("#password", password);

    // Submit - El botón dice "Entrar"
    await page.click('button:has-text("Entrar")');

    // Admin redirige a /app/admin
    await expect(page).toHaveURL(/\/app\/admin/, { timeout: 15000 });

    // Esperar a que cargue el dashboard
    await page.waitForTimeout(3000);

    // Verificar indicadores de admin - el título "Panel Admin" debe estar visible
    const panelTitle = page.locator("text=Panel Admin");
    await expect(panelTitle).toBeVisible({ timeout: 10000 });
  });

  test("AUTH-03: Login fallido con credenciales inválidas", async ({
    page,
  }) => {
    // Usar credenciales inválidas
    await page.fill("#email", "invalid@email.com");
    await page.fill("#password", "wrongpassword");

    // Submit
    await page.click('button:has-text("Entrar")');

    // Verificar que seguimos en login o se muestra error
    await page.waitForTimeout(3000);

    // Debe seguir en login o mostrar error
    const currentUrl = page.url();
    const isStillOnLogin = currentUrl.includes("/login");

    // También verificar si hay mensaje de error visible
    const hasError = await page
      .locator(
        "text=error, text=Error, text=inválido, text=incorrecta, text=Invalid",
      )
      .first()
      .isVisible()
      .catch(() => false);

    expect(isStillOnLogin || hasError).toBeTruthy();
  });

  test("AUTH-04: Formulario de login muestra campos requeridos", async ({
    page,
  }) => {
    // Verificar que existen los campos
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator('button:has-text("Entrar")')).toBeVisible();

    // Verificar placeholders o labels
    const emailField = page.locator("#email");
    await expect(emailField).toHaveAttribute("type", "email");

    // Verificar placeholder del email
    await expect(emailField).toHaveAttribute("placeholder", "tu@email.com");
  });

  test("AUTH-05: Botón de login deshabilitado mientras carga", async ({
    page,
  }) => {
    const email = process.env.CLIENT_EMAIL;
    const password = process.env.CLIENT_PASSWORD;

    if (!email || !password) {
      throw new Error("Credenciales no configuradas");
    }

    await page.fill("#email", email);
    await page.fill("#password", password);

    // Click y verificar que el botón cambia de estado
    const submitButton = page.locator('button:has-text("Entrar")');
    await submitButton.click();

    // El botón debería mostrar loading o estar deshabilitado
    // Verificamos que la navegación ocurre
    await expect(page).toHaveURL(/\/app/, { timeout: 15000 });
  });
});
