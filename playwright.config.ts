import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load .env.test parameters
dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
// Also load .env for Supabase credentials
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  // Global setup - ejecuta los seeders antes de todos los tests
  globalSetup: "./tests/setup/global-setup.ts",
  globalTeardown: "./tests/setup/global-teardown.ts",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
