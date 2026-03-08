import { test, expect } from "@playwright/test";
import { waitForPageLoad } from "../helpers/test-helpers";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";

test.describe("Update Required Modal", () => {
  test("UPDATE-01: en web forzado, el botón descarga APK directamente", async ({
    page,
  }) => {
    // Interceptar la petición de Supabase que obtiene la versión de la app.
    // Al devolver una versión mayor (2.0.0) que la versión local (1.0.0),
    // el hook useAppVersion detectará que hay una actualización requerida
    // y mostrará el modal bloqueante.
    await page.route(`${SUPABASE_URL}/rest/v1/app_settings*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ key: "app-version", value: "2.0.0" }),
      });
    });

    // Interceptar la descarga del APK desde Supabase Storage y devolver
    // una respuesta con cabeceras de descarga para que Playwright la capture
    // como un evento "download".
    await page.route(
      "**/storage/v1/object/public/releases/**",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/vnd.android.package-archive",
          headers: {
            "Content-Disposition":
              'attachment; filename="app-calistenia-emerita.apk"',
          },
          body: Buffer.from("mock-apk-content"),
        });
      },
    );

    await page.goto("/");
    await waitForPageLoad(page);

    // Esperar a que el hook useAppVersion termine de comparar versiones
    // (hace una petición async a Supabase)
    await page.waitForTimeout(2000);

    const updateButton = page.getByRole("button", {
      name: "Descargar Actualización",
    });

    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Actualización Necesaria")).toBeVisible();
    await expect(updateButton).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await updateButton.click();
    const download = await downloadPromise;

    await expect(page).not.toHaveURL(/\/update-app/);
    expect(download.suggestedFilename()).toBe("app-calistenia-emerita.apk");
  });
});
