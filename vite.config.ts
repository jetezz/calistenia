import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const isProductionBuild = mode === "production";

  const resolvedSupabaseUrl = isProductionBuild
    ? env.SUPABASE_URL_PROD || env.VITE_SUPABASE_URL
    : env.VITE_SUPABASE_URL;

  const resolvedSupabaseAnonKey = isProductionBuild
    ? env.SUPABASE_ANON_KEY_PROD || env.VITE_SUPABASE_ANON_KEY
    : env.VITE_SUPABASE_ANON_KEY;

  const resolvedAppEnv = isProductionBuild
    ? "production"
    : env.VITE_APP_ENV || mode;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        resolvedSupabaseUrl || "",
      ),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
        resolvedSupabaseAnonKey || "",
      ),
      "import.meta.env.VITE_APP_ENV": JSON.stringify(resolvedAppEnv),
    },
  };
});
