import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Detecta el modo
const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";

// 🔧 URL base para GitHub Pages
// (tiene que coincidir con el nombre del repositorio)
export default defineConfig({
  plugins: [react()],

  base: isProd ? "/yoquet_disenos_frontend/" : "/",

  server: {
    port: 5173,
    // 🔁 Proxy local para desarrollo (API de Django)
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000", // backend local
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // 🔍 Muestra errores reales en consola (no minificados)
  build: {
    sourcemap: true,
  },
});
