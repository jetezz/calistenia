/**
 * Global Teardown para Playwright
 *
 * Este archivo se ejecuta UNA VEZ después de todos los tests.
 * Limpia los datos de prueba creados.
 */

import { teardownTestData } from "./test-seeder";

async function globalTeardown() {
  console.log("\n" + "=".repeat(60));
  console.log("🎭 PLAYWRIGHT GLOBAL TEARDOWN");
  console.log("=".repeat(60) + "\n");

  try {
    // Limpiar los datos de test
    await teardownTestData();

    console.log("✅ Global teardown completed successfully");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("⚠️  Global teardown failed (non-critical):", error);
    // No lanzamos el error para no hacer fallar los tests
  }
}

export default globalTeardown;
