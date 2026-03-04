import { test, expect } from "@playwright/test";
import { waitForPageLoad } from "../helpers/test-helpers";

test.describe("Update Required Modal", () => {
  test("UPDATE-01: en web forzado, el botón descarga APK directamente", async ({ page }) => {
    await page.goto("/");
    await waitForPageLoad(page);

    const updateButton = page.getByRole("button", { name: "Descargar Actualización" });

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Actualización Necesaria")).toBeVisible();
    await expect(updateButton).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await updateButton.click();
    const download = await downloadPromise;

    await expect(page).not.toHaveURL(/\/update-app/);
    expect(download.suggestedFilename()).toBe("app-calistenia-emerita.apk");
  });
});
