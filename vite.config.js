import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Detecta el modo actual
const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";

// 🔧 CONFIGURACIÓN
export default defineConfig({
  plugins: [react()],

  // 👉 Para Render o cualquier hosting estático: siempre base './'
  // (GitHub Pages necesita la ruta del repo, Render no)
  base: isProd ? "./" : "/",

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

  // 🔍 Mostrar errores legibles en modo build
  build: {
    sourcemap: true,
  },
});

