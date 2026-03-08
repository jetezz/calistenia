/**
 * Global Teardown para Playwright
 *
 * Este archivo se ejecuta UNA VEZ después de todos los tests.
 * Limpia los datos de prueba creados.
 */

import { teardownTestData } from "./test-seeder";
import fs from "fs";
import path from "path";

async function globalTeardown() {
  console.log("\n" + "=".repeat(60));
  console.log("🎭 PLAYWRIGHT GLOBAL TEARDOWN");
  console.log("=".repeat(60) + "\n");

  try {
    // Limpiar los datos de test
    await teardownTestData();

    // Eliminar auth state de client2 (usuario eliminado, tokens ya no válidos)
    const client2AuthPath = path.resolve(process.cwd(), "playwright/.auth/client2.json");
    if (fs.existsSync(client2AuthPath)) {
      fs.unlinkSync(client2AuthPath);
    }

    console.log("✅ Global teardown completed successfully");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("⚠️  Global teardown failed (non-critical):", error);
    // No lanzamos el error para no hacer fallar los tests
  }
}

export default globalTeardown;
