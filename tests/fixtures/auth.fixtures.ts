/**
 * Fixtures de autenticación reutilizables para Playwright
 * Proporciona páginas pre-autenticadas como cliente y admin
 */

import { test as base, Page, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import type { Browser } from "@playwright/test";

// Tipos de usuario
export type UserRole = "admin" | "client" | "client2";

// Credenciales desde variables de entorno
const getCredentials = (role: UserRole) => {
  if (role === "admin") {
    return {
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
    };
  }
  if (role === "client2") {
    return {
      email: process.env.CLIENT2_EMAIL || "client2.e2e.test@example.com",
      password: process.env.CLIENT2_PASSWORD || "Password123!",
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

const AUTH_DIR = path.resolve(process.cwd(), "playwright/.auth");
const storageStatePath = (role: UserRole) =>
  path.join(AUTH_DIR, `${role}.json`);

async function createStorageState(
  browser: Browser,
  role: UserRole,
): Promise<string> {
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const authContext = await browser.newContext();
  const authPage = await authContext.newPage();

  await loginAs(authPage, role);

  const filePath = storageStatePath(role);
  await authContext.storageState({ path: filePath });
  await authContext.close();

  return filePath;
}

async function getOrCreateStorageState(
  browser: Browser,
  role: UserRole,
): Promise<string> {
  const filePath = storageStatePath(role);

  if (fs.existsSync(filePath)) {
    return filePath;
  }

  return createStorageState(browser, role);
}

async function createAuthenticatedPage(
  browser: Browser,
  role: UserRole,
): Promise<{ page: Page; cleanup: () => Promise<void> }> {
  let statePath = await getOrCreateStorageState(browser, role);

  let context = await browser.newContext({ storageState: statePath });
  let page = await context.newPage();

  const targetPath = role === "admin" ? "/app/admin" : "/app";
  await page.goto(targetPath);

  if (page.url().includes("/login")) {
    await context.close();
    statePath = await createStorageState(browser, role);
    context = await browser.newContext({ storageState: statePath });
    page = await context.newPage();
    await page.goto(targetPath);
  }

  await expect(page).toHaveURL(/\/app/, { timeout: 15000 });

  return {
    page,
    cleanup: async () => {
      await context.close();
    },
  };
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
  authenticatedClient2: Page;
}>({
  authenticatedClient: async ({ browser }, use) => {
    const { page, cleanup } = await createAuthenticatedPage(browser, "client");
    await use(page);
    await cleanup();
  },

  authenticatedAdmin: async ({ browser }, use) => {
    const { page, cleanup } = await createAuthenticatedPage(browser, "admin");
    await use(page);
    await cleanup();
  },

  authenticatedClient2: async ({ browser }, use) => {
    const { page, cleanup } = await createAuthenticatedPage(browser, "client2");
    await use(page);
    await cleanup();
  },
});

export { expect };
