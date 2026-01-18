/**
 * Funciones auxiliares para tests de Playwright
 * Contiene helpers para operaciones comunes en los tests
 */

import { Page, expect, Locator } from "@playwright/test";

/**
 * Espera a que la página cargue completamente
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
  await page.waitForLoadState("domcontentloaded");
}

/**
 * Espera a que desaparezcan los spinners/skeletons de carga
 */
export async function waitForLoadingComplete(page: Page): Promise<void> {
  // Esperar a que desaparezcan los skeletons
  const skeletons = page.locator(".skeleton, [class*='skeleton']");
  if ((await skeletons.count()) > 0) {
    await skeletons
      .first()
      .waitFor({ state: "hidden", timeout: 10000 })
      .catch(() => {});
  }

  // Esperar spinners
  const spinners = page.locator(".spinner, [class*='loading'], .animate-spin");
  if ((await spinners.count()) > 0) {
    await spinners
      .first()
      .waitFor({ state: "hidden", timeout: 10000 })
      .catch(() => {});
  }
}

/**
 * Navega a una ruta de la aplicación
 */
export async function navigateTo(page: Page, path: string): Promise<void> {
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  await page.goto(fullPath);
  await waitForPageLoad(page);
}

/**
 * Hace click en un elemento y espera la navegación
 */
export async function clickAndNavigate(
  page: Page,
  selector: string | Locator,
  expectedUrl?: string | RegExp,
): Promise<void> {
  const element =
    typeof selector === "string" ? page.locator(selector) : selector;

  await Promise.all([
    page.waitForURL(expectedUrl || /./, { timeout: 10000 }),
    element.click(),
  ]);
}

/**
 * Rellena un formulario con los datos proporcionados
 */
export async function fillForm(
  page: Page,
  fields: Record<string, string>,
): Promise<void> {
  for (const [selector, value] of Object.entries(fields)) {
    const element = page.locator(selector);
    await element.waitFor({ state: "visible" });
    await element.fill(value);
  }
}

/**
 * Verifica que un toast de éxito aparezca
 */
export async function expectToast(
  page: Page,
  type: "success" | "error" | "info" = "success",
  messageContains?: string,
): Promise<void> {
  // Sonner toasts
  const toastSelector = "[data-sonner-toast]";
  const toast = page.locator(toastSelector);

  await expect(toast.first()).toBeVisible({ timeout: 5000 });

  if (messageContains) {
    await expect(toast.first()).toContainText(messageContains);
  }
}

/**
 * Espera y cierra un modal/dialog
 */
export async function closeModal(page: Page): Promise<void> {
  const closeButton = page.locator(
    '[role="dialog"] button:has-text("Cerrar"), [role="dialog"] button[aria-label="Close"]',
  );
  if (await closeButton.isVisible()) {
    await closeButton.click();
    await page.waitForTimeout(300); // Esperar animación
  }
}

/**
 * Selecciona una opción de un dropdown/select
 */
export async function selectOption(
  page: Page,
  selector: string,
  value: string,
): Promise<void> {
  const select = page.locator(selector);

  // Si es un select nativo
  if (await select.evaluate((el) => el.tagName === "SELECT")) {
    await select.selectOption(value);
  } else {
    // Si es un dropdown personalizado (shadcn)
    await select.click();
    await page.waitForTimeout(200);
    await page.locator(`[role="option"]:has-text("${value}")`).click();
  }
}

/**
 * Obtiene el texto de un elemento de forma segura
 */
export async function getText(page: Page, selector: string): Promise<string> {
  const element = page.locator(selector);
  await element.waitFor({ state: "visible" });
  return (await element.textContent()) || "";
}

/**
 * Verifica que una tabla tenga filas
 */
export async function expectTableHasRows(
  page: Page,
  tableSelector: string = "table",
  minRows: number = 1,
): Promise<void> {
  const rows = page.locator(`${tableSelector} tbody tr`);
  await expect(rows).toHaveCount(minRows, { timeout: 10000 });
}

/**
 * Espera un tiempo específico (usar con moderación)
 */
export async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Captura una screenshot con nombre descriptivo
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Verifica que un elemento esté visible y tenga cierto texto
 */
export async function expectVisible(
  page: Page,
  selector: string,
  textContains?: string,
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeVisible({ timeout: 10000 });

  if (textContains) {
    await expect(element).toContainText(textContains);
  }
}

/**
 * Verifica que no haya errores en la consola
 */
export function setupConsoleErrorListener(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  return errors;
}

/**
 * Click en botón con confirmación (dialog)
 */
export async function clickWithConfirmation(
  page: Page,
  buttonSelector: string,
  confirmText: string = "Confirmar",
): Promise<void> {
  await page.locator(buttonSelector).click();
  await page.waitForTimeout(300);

  // Buscar y click en botón de confirmación
  const confirmButton = page.locator(`button:has-text("${confirmText}")`);
  if (await confirmButton.isVisible()) {
    await confirmButton.click();
  }
}

/**
 * Navega a una sección del dashboard admin
 */
export async function navigateToAdminSection(
  page: Page,
  section:
    | "dashboard"
    | "users"
    | "slots"
    | "bookings"
    | "payment-requests"
    | "pricing"
    | "payment-methods"
    | "settings",
): Promise<void> {
  const routes: Record<string, string> = {
    dashboard: "/app/admin",
    users: "/app/admin/users",
    slots: "/app/admin/slots",
    bookings: "/app/admin/bookings",
    "payment-requests": "/app/admin/payment-requests",
    pricing: "/app/admin/pricing",
    "payment-methods": "/app/admin/payment-methods",
    settings: "/app/admin/settings",
  };

  await page.goto(routes[section]);
  await waitForPageLoad(page);
  await waitForLoadingComplete(page);
}

/**
 * Navega a una sección del dashboard cliente
 */
export async function navigateToClientSection(
  page: Page,
  section:
    | "home"
    | "book"
    | "my-bookings"
    | "request-credits"
    | "payment-info"
    | "weight-stats",
): Promise<void> {
  const routes: Record<string, string> = {
    home: "/app",
    book: "/app/book",
    "my-bookings": "/app/my-bookings",
    "request-credits": "/app/request-credits",
    "payment-info": "/app/payment-info",
    "weight-stats": "/app/weight-stats",
  };

  await page.goto(routes[section]);
  await waitForPageLoad(page);
  await waitForLoadingComplete(page);
}
