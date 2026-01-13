import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: "public",
  server: { fs: { strict: true } },
  resolve: {
    alias: {
      "@icons": path.resolve(__dirname, "src/assets/icons"),

      // --- UI Layer ---
      "@charts": path.resolve(__dirname, "src/components/charts"),
      "@ui": path.resolve(__dirname, "src/components/ui"),
      "@layout": path.resolve(__dirname, "src/components/layout"),
      "@table": path.resolve(__dirname, "src/features/trade-metrics/table"),

      // --- Stores ---
      "@stores": path.resolve(__dirname, "src/stores"),

      // --- Features / Pages ---
      "@features": path.resolve(__dirname, "src/features"),

      // --- Data ---
      "@data": path.resolve(__dirname, "src/data"),

      // --- Utils and Helpers ---
      "@utils": path.resolve(__dirname, "src/utils"),
      "@lib": path.resolve(__dirname, "src/lib"),

      // --- Hooks ---
      "@hooks": path.resolve(__dirname, "src/hooks"),

      "@Profiler": path.resolve(__dirname, "src/RenderLogger"),
      "@RM": path.resolve(__dirname, "src/pages/RiskManagement"),
      "@Dashboard": path.resolve(__dirname, "src/pages/Dashboard"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});
