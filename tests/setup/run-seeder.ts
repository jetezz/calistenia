/**
 * Script para ejecutar el seeder manualmente
 */
import { setupTestData } from "./test-seeder";

console.log("🚀 Running test seeder...\n");

setupTestData()
  .then((result) => {
    console.log("\n✅ Seeder executed successfully");
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeder failed:", error);
    process.exit(1);
  });
