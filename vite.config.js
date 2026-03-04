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

      "@config": path.resolve(__dirname, "src/config"),

      "@shared": path.resolve(__dirname, "src/shared"),
      "@modules": path.resolve(__dirname, "src/modules"),

      "@features": path.resolve(__dirname, "src/features"),

      "@lib": path.resolve(__dirname, "src/lib"),

      "@pages": path.resolve(__dirname, "src/pages"),

      // --- Data ---
      "@data": path.resolve(__dirname, "src/data"),

      "@Profiler": path.resolve(__dirname, "src/RenderLogger"),
      "@RM": path.resolve(__dirname, "src/pages/RiskManagement"),
      "@Dashboard": path.resolve(__dirname, "src/pages/Dashboard"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});
