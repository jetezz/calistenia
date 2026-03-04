import { test, expect } from "@playwright/test";
import { waitForPageLoad } from "../helpers/test-helpers";

test.describe("Update Required Modal", () => {
  test("UPDATE-01: muestra modal de actualización en web cuando está forzado por env", async ({ page }) => {
    await page.goto("/");
    await waitForPageLoad(page);

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Actualización Necesaria")).toBeVisible();
    await expect(page.getByRole("button", { name: "Descargar Actualización" })).toBeVisible();
  });
});
