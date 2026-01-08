/**
 * Script to apply the admin data functions migration to Supabase
 *
 * This script reads the migration file and applies it to your Supabase database
 * Run with: pnpm tsx supabase/scripts/apply-admin-data-migration.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing environment variables!");
  console.error("Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log("🚀 Applying admin data functions migration...\n");

  try {
    // Read the migration file
    const migrationPath = join(
      process.cwd(),
      "supabase",
      "migrations",
      "20260108_create_admin_data_functions.sql"
    );
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    console.log("📄 Migration file loaded");
    console.log("📊 Executing SQL...\n");

    // Execute the migration
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: migrationSQL,
    });

    if (error) {
      // If exec_sql doesn't exist, we need to apply it manually
      console.log("⚠️  exec_sql function not available");
      console.log(
        "\n📋 Please apply this migration manually in Supabase Dashboard:"
      );
      console.log(
        "   1. Go to https://supabase.com/dashboard/project/gnptmzkxmludhdwoulia/sql/new"
      );
      console.log(
        "   2. Copy the content from: supabase/migrations/20260108_create_admin_data_functions.sql"
      );
      console.log("   3. Paste and run it in the SQL Editor");
      console.log("\n   Or use Supabase CLI:");
      console.log("   supabase db push\n");
      return;
    }

    console.log("✅ Migration applied successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Run: pnpm run types");
    console.log(
      "   2. This will regenerate TypeScript types with the new RPC functions\n"
    );
  } catch (error) {
    console.error("❌ Error applying migration:", error);
    console.log("\n📋 Manual application required:");
    console.log(
      "   1. Go to https://supabase.com/dashboard/project/gnptmzkxmludhdwoulia/sql/new"
    );
    console.log(
      "   2. Copy the content from: supabase/migrations/20260108_create_admin_data_functions.sql"
    );
    console.log("   3. Paste and run it in the SQL Editor\n");
  }
}

applyMigration();
