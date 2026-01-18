/**
 * Global Setup para Playwright
 *
 * Este archivo se ejecuta UNA VEZ antes de todos los tests.
 * Inicializa los datos de prueba necesarios.
 */

import { setupTestData } from "./test-seeder";

async function globalSetup() {
  console.log("\n" + "=".repeat(60));
  console.log("🎭 PLAYWRIGHT GLOBAL SETUP");
  console.log("=".repeat(60) + "\n");

  try {
    // Ejecutar el seeder para crear los datos de test
    const testData = await setupTestData();

    // Guardar información de los datos de test en variables de entorno
    // para que los tests puedan acceder a ellos
    process.env.TEST_RECURRING_DAY = testData.recurringDay.toString();
    process.env.TEST_SPECIFIC_DATE = testData.specificDate;
    process.env.TEST_RECURRING_SLOT_ID = testData.recurringSlotId;
    process.env.TEST_SPECIFIC_SLOT_ID = testData.specificSlotId;

    console.log("✅ Global setup completed successfully");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    throw error;
  }
}

export default globalSetup;
