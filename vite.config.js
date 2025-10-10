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
  resolve: {
    alias: {
      "@icons": path.resolve(__dirname, "src/assets/icons"),
      "@charts": path.resolve(__dirname, "src/components/charts"),
      "@ui": path.resolve(__dirname, "src/components/ui"),
      "@layout": path.resolve(__dirname, "src/components/layout"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@features": path.resolve(__dirname, "src/features"),
      "@data": path.resolve(__dirname, "src/data"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@hooks": path.resolve(__dirname, "src/hooks"),

      "@Profiler": path.resolve(__dirname, "src/RenderLogger"),
      "@RM": path.resolve(__dirname, "src/pages/RiskManagement"),
      "@Dashboard": path.resolve(__dirname, "src/pages/Dashboard"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});
