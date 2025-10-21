import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Detecta si estás en producción de forma segura
const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";

export default defineConfig({
  plugins: [react()],
  base: isProd ? "/yoquet_disenos_frontend/" : "/",
  server: {
    port: 5173,
  },
});
