/**
 * Fixtures de autenticación reutilizables para Playwright
 * Proporciona páginas pre-autenticadas como cliente y admin
 */

import { test as base, Page, expect } from "@playwright/test";

// Tipos de usuario
export type UserRole = "admin" | "client";

// Credenciales desde variables de entorno
const getCredentials = (role: UserRole) => {
  if (role === "admin") {
    return {
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
    };
  }
  return {
    email: process.env.CLIENT_EMAIL!,
    password: process.env.CLIENT_PASSWORD!,
  };
};

// Función de login reutilizable
export async function loginAs(page: Page, role: UserRole): Promise<void> {
  const credentials = getCredentials(role);

  if (!credentials.email || !credentials.password) {
    throw new Error(`Missing credentials for ${role}. Check .env.test file.`);
  }

  // Navegar a la página de login
  await page.goto("/login");

  // Esperar a que el formulario esté listo
  await page.waitForSelector("#email", { state: "visible", timeout: 10000 });

  // Llenar credenciales
  await page.fill("#email", credentials.email);
  await page.fill("#password", credentials.password);

  // Click en el botón de login - El botón dice "Entrar"
  await page.click('button:has-text("Entrar")');

  // Esperar a que se complete la navegación
  await expect(page).toHaveURL(/\/app/, { timeout: 15000 });

  // Esperar un momento adicional para que se carguen los datos
  await page.waitForTimeout(1000);
}

// Función para hacer logout
export async function logout(page: Page): Promise<void> {
  // Buscar el menú de usuario o botón de logout
  const logoutButton = page.locator(
    'button:has-text("Cerrar"), button:has-text("Logout"), [data-testid="logout-button"], button[aria-label="Cerrar sesión"]',
  );

  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  } else {
    // Intentar encontrar un menú desplegable primero
    const userMenu = page.locator(
      '[data-testid="user-menu"], .user-menu, button:has(.avatar)',
    );
    if (await userMenu.isVisible()) {
      await userMenu.click();
      await page.waitForTimeout(500);
      await page.click("text=Cerrar sesión");
    }
  }

  // Esperar redirección al login
  await expect(page).toHaveURL(/\/(login)?$/, { timeout: 10000 });
}

// Fixture personalizado con páginas autenticadas
export const test = base.extend<{
  authenticatedClient: Page;
  authenticatedAdmin: Page;
}>({
  authenticatedClient: async ({ page }, use) => {
    await loginAs(page, "client");
    await use(page);
  },

  authenticatedAdmin: async ({ page }, use) => {
    await loginAs(page, "admin");
    await use(page);
  },
});

export { expect };
